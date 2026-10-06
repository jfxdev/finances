import { test, expect } from '@playwright/test';
const setupToken = process.env.E2E_SETUP_TOKEN;
if (!setupToken)
  throw new Error('E2E_SETUP_TOKEN deve ser o token de uma instalação exclusiva de testes');
// The shared API limits requests per IP, including assets. Reserve enough capacity
// for each workflow instead of letting a preceding browser test exhaust its window.
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(120000);
  const response = await page.request.get('/api/v1/auth/setup');
  const remaining = response.headers()['x-ratelimit-remaining'];
  const reset = Number(response.headers()['x-ratelimit-reset']);
  if (remaining !== undefined && Number(remaining) < 180 && reset > 0)
    await new Promise((resolve) => setTimeout(resolve, (reset + 1) * 1000));
});
test('public signup and invitation sharing preserve the invite and select the accepted space', async ({
  page,
  browser,
}) => {
  const suffix = `${Date.now()}-${test.info().project.name}`;
  const owner = await page.request.post('/api/v1/auth/register', {
    data: {
      email: `owner-${suffix}@example.test`,
      name: 'Space Owner',
      password: 'browser-strong-password',
      setupToken,
    },
  });
  expect(owner.status()).toBe(201);
  const { csrf } = await owner.json();
  const spaces = await (await page.request.get('/api/v1/spaces')).json();
  const personal = spaces[0];
  expect(personal.personal).toBe(true);
  expect(
    (
      await page.request.patch(`/api/v1/spaces/${personal.id}`, {
        headers: { 'x-csrf-token': csrf },
        data: {
          name: 'Shared household',
          currency: personal.currency,
          timezone: personal.timezone,
          version: personal.version,
        },
      })
    ).ok(),
  ).toBe(true);
  await page.goto('/settings');
  await page.getByRole('tab', { name: 'Espaços', exact: true }).click();
  await page.getByRole('button', { name: 'Convidar pessoas', exact: true }).click();
  await expect(page.getByText(/este espaço pessoal passará a ser compartilhado/)).toBeVisible();
  await page.getByRole('button', { name: 'Compartilhar e criar convite', exact: true }).click();
  const inviteUrl = await page
    .getByRole('textbox', { name: 'Convite · válido por sete dias' })
    .inputValue();
  const invitePath = `/invite${new URL(inviteUrl).hash}`;
  const guestContext = await browser.newContext({ viewport: page.viewportSize()! });
  try {
    const guest = await guestContext.newPage();
    await guest.goto(`${new URL(page.url()).origin}${invitePath}`);
    await expect(guest.getByRole('heading', { name: 'Crie sua conta', exact: true })).toBeVisible();
    await expect(guest.getByText(/Você recebeu um convite/)).toBeVisible();
    await guest.getByRole('button', { name: 'Já tenho uma conta', exact: true }).click();
    await expect(guest.getByRole('heading', { name: 'Bem-vindo de volta' })).toBeVisible();
    expect(new URL(guest.url()).hash).toBe(new URL(inviteUrl).hash);
    await guest.getByRole('button', { name: 'Criar uma conta', exact: true }).click();
    await guest.getByLabel('Seu nome').fill('Invited Guest');
    await guest.getByLabel('Email', { exact: true }).fill(`guest-${suffix}@example.test`);
    await guest.getByLabel('Senha', { exact: true }).fill('browser-strong-password');
    await guest.getByRole('button', { name: 'Criar conta', exact: true }).click();
    await guest.getByRole('button', { name: 'Aceitar convite', exact: true }).click();
    await expect(guest.getByRole('heading', { name: 'Visão geral', exact: true })).toBeVisible();
    await expect(
      guest.getByText('Shared household · Somente leitura', { exact: true }),
    ).toBeVisible();
    expect(
      await guest.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    await guest.screenshot({
      path: `test-results/invite-${test.info().project.name}.png`,
      fullPage: true,
    });
  } finally {
    await guestContext.close();
  }
  const signupContext = await browser.newContext();
  try {
    const signup = await signupContext.newPage();
    await signup.goto(`${new URL(page.url()).origin}/register`);
    await expect(
      signup.getByRole('heading', { name: 'Crie sua conta', exact: true }),
    ).toBeVisible();
    await expect(signup.getByLabel('Token de configuração')).toHaveCount(0);
  } finally {
    await signupContext.close();
  }
});
test('money fields restrict characters and currency precision while saving exact decimals', async ({
  page,
}) => {
  const registered = await page.request.post('/api/v1/auth/register', {
    data: {
      email: `money-${Date.now()}-${test.info().project.name}@example.test`,
      name: 'Money Tester',
      password: 'browser-strong-password',
      setupToken,
    },
  });
  expect(registered.status()).toBe(201);
  const { csrf } = await registered.json();
  for (const sample of [
    {
      currency: 'BRL',
      valid: '12,34',
      dot: '12.34',
      invalid: '12.345',
      input: '000,50',
      amount: '0.50',
    },
    { currency: 'JPY', valid: '12', dot: '12', invalid: '12,3', input: '00012', amount: '12' },
    {
      currency: 'KWD',
      valid: '12,345',
      dot: '12.345',
      invalid: '12.3456',
      input: '.125',
      amount: '0.125',
    },
  ]) {
    const created = await page.request.post('/api/v1/spaces', {
      headers: { 'x-csrf-token': csrf },
      data: {
        name: `Amounts ${sample.currency}`,
        currency: sample.currency,
        timezone: 'America/Sao_Paulo',
      },
    });
    expect(created.status()).toBe(201);
    const { id } = await created.json();
    await page.goto('/');
    await page.evaluate((spaceId) => localStorage.setItem('finances-space', spaceId), id);
    await page.reload();
    await page.getByRole('button', { name: 'Adicionar despesa', exact: true }).click();
    await page.getByRole('button', { name: 'Netflix', exact: true }).click();
    const amount = page.getByLabel(`Valor (${sample.currency})`, { exact: true });
    await expect(amount).toHaveValue(
      sample.currency === 'JPY' ? '000' : sample.currency === 'KWD' ? '000,000' : '000,00',
    );
    await amount.focus();
    await amount.pressSequentially('5');
    await expect(amount).toHaveValue('5');
    await expect(amount).toHaveAttribute(
      'inputmode',
      sample.currency === 'JPY' ? 'numeric' : 'decimal',
    );
    await amount.fill(sample.valid);
    await amount.pressSequentially('abc-+e ');
    await expect(amount).toHaveValue(sample.valid);
    for (const invalid of [sample.invalid, '1,2.3', '1..23', '99abc', '-10', '1e3', '1 000']) {
      await amount.fill(invalid);
      await expect(amount).toHaveValue(sample.valid);
    }
    await amount.fill('');
    await expect(amount).toHaveValue('');
    await amount.fill(sample.dot);
    await expect(amount).toHaveValue(sample.dot);
    await amount.fill(sample.input);
    const saving = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/spaces/${id}/expenses`) && response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Salvar', exact: true }).click();
    const saved = await saving;
    expect(saved.status()).toBe(201);
    expect((await saved.json()).data.amount).toBe(sample.amount);
  }
  await page.goto('/investments');
  await page.getByRole('button', { name: 'Novo investimento', exact: true }).click();
  const balance = page.getByLabel('Saldo inicial (KWD)', { exact: true });
  const goal = page.getByLabel('Meta de valor (opcional)', { exact: true });
  await expect(balance).toHaveValue('000,000');
  await expect(goal).toHaveValue('000,000');
  await balance.fill('abc');
  await expect(balance).toHaveValue('000,000');
  await goal.fill('100abc');
  await expect(goal).toHaveValue('000,000');
  await page.getByLabel('Nome', { exact: true }).fill('Zero balance');
  const savingInvestment = page.waitForResponse(
    (response) => response.url().endsWith('/investments') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  const savedInvestment = await savingInvestment;
  expect(savedInvestment.status()).toBe(201);
  const investment = await savedInvestment.json();
  expect(investment.data).toMatchObject({ initialBalance: '0.000', goal: null });
  await page.getByRole('button', { name: 'Editar Zero balance', exact: true }).click();
  await expect(goal).toHaveValue('000,000');
  await expect(balance).toHaveAttribute('readonly', '');
  await goal.fill('200.125');
  await expect(balance).toHaveValue('0.000');
  await expect(goal).toHaveValue('200.125');
});
test('mobile and desktop financial workflows, installation and offline privacy', async ({
  page,
  context,
  isMobile,
}) => {
  const email = `browser-${Date.now()}@example.test`;
  await page.goto('/');
  const setup = await page.request.get('/api/v1/auth/setup');
  if ((await setup.json()).configured) {
    await page.getByRole('button', { name: 'Criar uma conta', exact: true }).click();
  }
  await page.getByLabel('Seu nome').fill('Browser Tester');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill('browser-strong-password');
  if (!(await setup.json()).configured)
    await page.getByLabel('Token de configuração').fill(setupToken);
  await page
    .getByRole('button', {
      name: (await setup.json()).configured ? 'Criar conta' : 'Configurar instalação',
      exact: true,
    })
    .click();
  await expect(page.getByRole('heading', { name: 'Visão geral', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Adicionar despesa', exact: true }).click();
  await page.getByRole('button', { name: 'Netflix', exact: true }).click();
  await page.getByLabel(/Valor \(BRL\)/).fill('39,90');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.getByText('Registro salvo', { exact: true })).toBeVisible();
  await expect(page.getByText('R$ 39,90', { exact: true }).first()).toBeVisible();
  async function navigate(name: string) {
    if (!(await page.getByRole('link', { name, exact: true }).isVisible()))
      await page.getByRole('button', { name: 'Abrir navegação' }).click();
    await page.getByRole('link', { name, exact: true }).click();
    if (
      await page
        .getByRole('dialog')
        .isVisible()
        .catch(() => false)
    )
      await page.keyboard.press('Escape');
  }
  await navigate('Lançamentos');
  await expect(page.getByText('Netflix', { exact: true })).toBeVisible();
  const netflixRow = page.getByRole('row').filter({ hasText: 'Netflix' });
  await expect(netflixRow).toContainText('Confirmado');
  await expect(netflixRow.getByRole('button', { name: 'Confirmar lançamento' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Editar Netflix' }).click();
  await page.getByLabel('Descrição', { exact: true }).fill('Netflix atualizado');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.getByText('Netflix atualizado', { exact: true })).toBeVisible();
  await navigate('Recorrências');
  await page.getByRole('button', { name: 'Nova recorrência' }).click();
  await page.getByRole('button', { name: 'ChatGPT', exact: true }).click();
  await page.getByLabel(/Valor \(BRL\)/).fill('100');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  const expenseRecurrences = page.getByRole('table', { name: 'Recorrências de despesas' });
  await expect(expenseRecurrences.getByText('ChatGPT', { exact: true })).toBeVisible();
  if (isMobile) {
    const savedNotification = page
      .locator('[data-sonner-toast]')
      .filter({ hasText: 'Registro salvo' })
      .first();
    await expect(savedNotification).toBeVisible();
    // Keep the notification visible while editing to catch overlapping mobile feedback.
    await savedNotification.hover();
  }
  await expenseRecurrences.getByRole('button', { name: 'Editar ChatGPT' }).click({ timeout: 5000 });
  await page.getByRole('switch', { name: 'Pausada', exact: true }).check();
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  const inactiveRecurrence = expenseRecurrences.getByRole('row').filter({ hasText: 'ChatGPT' });
  await expect(inactiveRecurrence).toHaveCSS('opacity', '0.5');
  await expect(inactiveRecurrence.getByRole('cell').first()).toHaveCSS(
    'text-decoration-line',
    'line-through',
  );
  await navigate('Investimentos');
  await page.getByRole('button', { name: 'Novo investimento' }).click();
  await page.getByLabel('Nome', { exact: true }).fill('Minha reserva');
  await page.getByLabel('Saldo inicial (BRL)').fill('100');
  await page.getByLabel('Meta de valor (opcional)').fill('500');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.getByText('Minha reserva', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ver evolução e movimentos' }).click();
  await page.getByRole('button', { name: 'Aporte ou resgate', exact: true }).click();
  await page.getByLabel('Valor (BRL)', { exact: true }).fill('50');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Aporte', exact: true })).toBeVisible();
  await expect(page.getByText(/150,00/).first()).toBeVisible();
  await navigate('Configurações');
  await page.getByRole('tab', { name: 'API keys' }).click();
  await page.getByRole('button', { name: 'Nova chave' }).click();
  await page.getByLabel('Nome', { exact: true }).fill('Browser agent');
  await page.getByRole('checkbox', { name: 'Despesas: Ler' }).check();
  await page.getByRole('button', { name: 'Criar chave', exact: true }).click();
  const secret = await page
    .getByRole('textbox', { name: 'Sua API key · exibida apenas uma vez' })
    .inputValue();
  expect(secret.length).toBe(43);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Revogar', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await expect(page.getByText('Revogada', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ativar tema escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Ativar tema claro' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const manifest = await page.request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  expect((await manifest.json()).display).toBe('standalone');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Configurações', exact: true })).toBeVisible();
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    return (
      await Promise.all(
        keys.map(async (k) => (await (await caches.open(k)).keys()).map((r) => r.url)),
      )
    ).flat();
  });
  expect(cached.some((url) => url.includes('/api/') || url.includes('/mcp'))).toBe(false);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Você está sem conexão' })).toBeVisible();
  await expect(page.getByText('Minha reserva', { exact: true })).not.toBeVisible();
  await context.setOffline(false);
  await expect(page.getByRole('heading', { name: 'Configurações', exact: true })).toBeVisible();
  await navigate('Visão geral');
  await expect(page.getByRole('heading', { name: 'Visão geral', exact: true })).toBeVisible();
  await expect(page.getByText('Para onde foi seu dinheiro', { exact: true })).toBeVisible();
  await expect(page.locator('.recharts-bar-rectangle').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({
    path: `test-results/dashboard-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Sair da conta', exact: true }).last().click();
  await expect(page.getByRole('heading', { name: 'Bem-vindo de volta' })).toBeVisible();
  const screenshot = `test-results/finances-${test.info().project.name}.png`;
  await page.screenshot({ path: screenshot, fullPage: true });
});

test('investment tax, annual projection and immutable cumulative entries work on all screen sizes', async ({
  page,
}) => {
  const response = await page.request.post('/api/v1/auth/register', {
    data: {
      email: `investment-${Date.now()}-${test.info().project.name}@example.test`,
      name: 'Investment Tester',
      password: 'browser-strong-password',
      setupToken,
    },
  });
  expect(response.status()).toBe(201);
  const { csrf } = await response.json();
  const spaceResponse = await page.request.get('/api/v1/spaces');
  expect(spaceResponse.status()).toBe(200);
  const [space] = await spaceResponse.json();
  const created = await page.request.post(`/api/v1/spaces/${space.id}/investments`, {
    headers: { 'x-csrf-token': csrf },
    data: {
      name: 'CDB semanal',
      type: 'investment',
      product: 'cdb',
      initialBalance: '1000',
      startDate: '2026-01-01',
      maturityDate: '2027-01-01',
      expectedAnnualReturn: 10,
      taxable: true,
      taxRate: 20,
    },
  });
  expect(created.status()).toBe(201);
  const investment = await created.json();
  await page.goto('/investments');
  await expect(page.getByText('CDB semanal', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Excluir CDB semanal', exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Editar CDB semanal', exact: true }).click();
  await expect(page.getByLabel('Incide imposto', { exact: true })).toBeChecked();
  await expect(page.getByLabel('Rentabilidade anual esperada (%)', { exact: true })).toHaveValue(
    '10',
  );
  await expect(page.getByLabel('Saldo inicial (BRL)', { exact: true })).toHaveAttribute(
    'readonly',
    '',
  );
  await expect(page.getByLabel('Data inicial', { exact: true })).toBeDisabled();
  await page.getByLabel('Imposto sobre o rendimento (%)', { exact: true }).fill('15,5');
  const saved = page.waitForResponse(
    (r) => r.url().endsWith(`/investments/${investment.id}`) && r.request().method() === 'PATCH',
  );
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  expect((await saved).status()).toBe(200);
  await page.getByRole('button', { name: 'Ver evolução e movimentos', exact: true }).click();
  await expect(page.getByText('Estimativa no vencimento', { exact: true })).toBeVisible();
  await expect(page.getByText('R$ 1.084,50', { exact: true })).toBeVisible();
  await expect(page.getByText(/Pontos a cada 7 dias/)).toBeVisible();
  await page.getByRole('button', { name: 'Aporte ou resgate', exact: true }).click();
  await page.getByLabel('Valor (BRL)', { exact: true }).fill('200');
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Aporte', exact: true })).toBeVisible();
  await expect(page.getByText('R$ 1.200,00', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Editar registro', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Excluir registro', exact: true })).toHaveCount(0);
  const report = await (
    await page.request.get(`/api/v1/spaces/${space.id}/investments/${investment.id}/report`)
  ).json();
  expect(report.deposits).toBe('1200.00');
  expect(report.projection.net).not.toBe('1084.50');
  await page.screenshot({
    path: `test-results/investment-detail-${test.info().project.name}.png`,
    fullPage: true,
    style: '[data-sonner-toaster] { display: none !important; }',
  });
  await page.getByRole('button', { name: 'Todos os investimentos', exact: true }).click();
  await page.getByRole('button', { name: 'Editar CDB semanal', exact: true }).click();
  await page.getByLabel('Incide imposto', { exact: true }).uncheck();
  await expect(page.getByLabel('Imposto sobre o rendimento (%)', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Salvar', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Ver evolução e movimentos', exact: true }),
  ).toBeVisible();
  const exempt = await (
    await page.request.get(`/api/v1/spaces/${space.id}/investments/${investment.id}/report`)
  ).json();
  expect(exempt.projection.tax).toBe('0.00');
  expect(exempt.projection.net).toBe(exempt.projection.gross);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({
    path: `test-results/investments-${test.info().project.name}.png`,
    fullPage: true,
  });
});

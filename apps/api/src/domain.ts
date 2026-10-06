import type { Recurrence, Investment, Movement, Valuation } from '@finances/contracts';
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export function fail(status: number, code: string, message: string): never {
  throw new AppError(status, code, message);
}
export function decimals(currency: string) {
  return (
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}
export function units(value: string, currency: string): bigint {
  const scale = decimals(currency);
  const negative = value.startsWith('-');
  const [whole, fraction = ''] = (negative ? value.slice(1) : value).split('.');
  if (fraction.length > scale)
    fail(400, 'MONEY_SCALE', `A moeda ${currency} aceita ${scale} casas decimais`);
  return (
    (negative ? -1n : 1n) *
    (BigInt(whole) * 10n ** BigInt(scale) + BigInt(fraction.padEnd(scale, '0') || '0'))
  );
}
export function money(value: bigint, currency: string): string {
  const s = decimals(currency);
  const sign = value < 0n ? '-' : '';
  const n = (value < 0n ? -value : value).toString().padStart(s + 1, '0');
  return sign + (s ? `${n.slice(0, -s)}.${n.slice(-s)}` : n);
}
export function today(timezone: string, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
export function monthRange(month: string) {
  const [y, m] = month.split('-').map(Number);
  return { from: `${month}-01`, to: new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10) };
}
export function horizon(timezone: string, now = new Date()) {
  const [y, m] = today(timezone, now).split('-').map(Number);
  return new Date(Date.UTC(y, m + 1, 0)).toISOString().slice(0, 10);
}
export function occurrence(r: Recurrence, index: number) {
  const [y, m, d] = r.startDate.split('-').map(Number);
  const n = index * r.interval;
  if (r.frequency === 'daily' || r.frequency === 'weekly')
    return new Date(Date.UTC(y, m - 1, d + n * (r.frequency === 'weekly' ? 7 : 1)))
      .toISOString()
      .slice(0, 10);
  const targetMonth = r.frequency === 'monthly' ? m - 1 + n : m - 1;
  const targetYear = r.frequency === 'yearly' ? y + n : y;
  const maxDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return new Date(Date.UTC(targetYear, targetMonth, Math.min(d, maxDay)))
    .toISOString()
    .slice(0, 10);
}
export function* occurrences(r: Recurrence, from: string, to: string) {
  // Jump near the requested window so a decades-old recurrence doesn't require an unbounded scan.
  const start = new Date(`${r.startDate}T00:00:00Z`);
  const lower = new Date(`${from}T00:00:00Z`);
  const delta =
    r.frequency === 'daily'
      ? (+lower - +start) / 86400000
      : r.frequency === 'weekly'
        ? (+lower - +start) / 604800000
        : r.frequency === 'monthly'
          ? (lower.getUTCFullYear() - start.getUTCFullYear()) * 12 +
            lower.getUTCMonth() -
            start.getUTCMonth()
          : lower.getUTCFullYear() - start.getUTCFullYear();
  for (let i = Math.max(0, Math.floor(delta / r.interval) - 1); ; i++) {
    const date = occurrence(r, i);
    if (date > to || (r.endDate && date > r.endDate)) break;
    if (date >= from) yield date;
  }
}
export function investmentTotals(
  i: Investment,
  movements: Movement[],
  valuations: Valuation[],
  currency: string,
  asOf = '9999-12-31',
) {
  const ms = movements.filter((m) => m.date <= asOf);
  const vs = valuations.filter((v) => v.date <= asOf).sort((a, b) => a.date.localeCompare(b.date));
  const last = vs.at(-1);
  const initial = i.startDate <= asOf ? units(i.initialBalance, currency) : 0n;
  const deposits = ms
    .filter((m) => m.type === 'deposit')
    .reduce((a, m) => a + units(m.amount, currency), initial);
  const withdrawals = ms
    .filter((m) => m.type === 'withdrawal')
    .reduce((a, m) => a + units(m.amount, currency), 0n);
  const current = ms
    .filter((m) => !last || m.date > last.date)
    .reduce(
      (a, m) => a + (m.type === 'deposit' ? 1n : -1n) * units(m.amount, currency),
      last ? units(last.amount, currency) : initial,
    );
  const goal = i.goal ? units(i.goal, currency) : null;
  return {
    current: money(current, currency),
    deposits: money(deposits, currency),
    withdrawals: money(withdrawals, currency),
    result: money(current + withdrawals - deposits, currency),
    progress: goal ? Number((current * 10000n) / goal) / 100 : null,
  };
}

const dayMs = 86400000;
const growthScale = 10n ** 15n;
function compound(principal: bigint, annualRate: number, days: number) {
  // Only the rate factor uses floating point; balances retain exact monetary units.
  let factor = BigInt(Math.round((1 + annualRate / 100) ** (1 / 365) * Number(growthScale)));
  let power = growthScale;
  for (let n = days; n > 0; n = Math.floor(n / 2)) {
    if (n % 2) power = (power * factor + growthScale / 2n) / growthScale;
    factor = (factor * factor + growthScale / 2n) / growthScale;
  }
  return (principal * power + growthScale / 2n) / growthScale;
}
export function weeklyDates(from: string, to: string) {
  if (to < from) return [];
  const dates: string[] = [];
  const end = +new Date(`${to}T00:00:00Z`);
  for (let time = +new Date(`${from}T00:00:00Z`); time <= end; time += 7 * dayMs)
    dates.push(new Date(time).toISOString().slice(0, 10));
  if (dates.at(-1) !== to) dates.push(to);
  return dates;
}
export function investmentReport(
  i: Investment,
  movements: Movement[],
  valuations: Valuation[],
  currency: string,
  asOf: string,
) {
  const history = weeklyDates(i.startDate, asOf).map((date) => ({
    date,
    ...investmentTotals(i, movements, valuations, currency, date),
  }));
  const totals = investmentTotals(i, movements, valuations, currency, asOf);
  if (!i.maturityDate || i.expectedAnnualReturn == null)
    return { ...totals, history, projection: null, forecast: [] };

  function estimate(date: string) {
    const last = valuations
      .filter((v) => v.date <= date && v.date <= asOf)
      .sort((a, b) => a.date.localeCompare(b.date))
      .at(-1);
    let balance = units(last?.amount ?? i.initialBalance, currency) * growthScale;
    let previous = last?.date ?? i.startDate;
    const grow = (until: string) => {
      balance = compound(
        balance,
        i.expectedAnnualReturn!,
        (+new Date(until) - +new Date(previous)) / dayMs,
      );
      previous = until;
    };
    for (const m of movements
      .filter((m) => m.date <= date && (!last || m.date > last.date))
      .sort((a, b) => a.date.localeCompare(b.date))) {
      grow(m.date);
      balance += (m.type === 'deposit' ? 1n : -1n) * units(m.amount, currency) * growthScale;
    }
    grow(date);
    const basis = investmentTotals(i, movements, [], currency, date);
    const gross = (balance + growthScale / 2n) / growthScale;
    const earnings = gross + units(basis.withdrawals, currency) - units(basis.deposits, currency);
    const taxRate = BigInt(Math.round((i.taxRate ?? 0) * 1000000));
    const tax = i.taxable && earnings > 0n ? (earnings * taxRate + 50000000n) / 100000000n : 0n;
    return {
      date,
      gross: money(gross, currency),
      earnings: money(earnings, currency),
      tax: money(tax, currency),
      net: money(gross - tax, currency),
    };
  }
  const final = estimate(i.maturityDate);
  return {
    ...totals,
    history,
    projection: {
      maturityDate: i.maturityDate,
      gross: final.gross,
      earnings: final.earnings,
      tax: final.tax,
      net: final.net,
    },
    forecast: weeklyDates(i.startDate, i.maturityDate).map((date) => {
      const { gross, net } = estimate(date);
      return { date, gross, net };
    }),
  };
}

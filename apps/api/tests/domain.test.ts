import { describe, it, expect } from 'vitest';
import { randomBytes } from 'node:crypto';
import {
  recurrenceSchema,
  investmentSchema,
  transactionSchema,
  dateSchema,
  spaceSchema,
} from '@finances/contracts';
import {
  units,
  money,
  occurrence,
  occurrences,
  investmentTotals,
  investmentReport,
  weeklyDates,
  horizon,
  today,
} from '../src/domain.js';
import { encrypt, decrypt } from '../src/crypto.js';
import { readConfig } from '../src/config.js';
const id = '00000000-0000-4000-8000-000000000001';
describe('money and contracts', () => {
  it('uses exact decimals including amounts beyond safe integers', () => {
    expect(money(units('9007199254740993.99', 'BRL') + units('0.01', 'BRL'), 'BRL')).toBe(
      '9007199254740994.00',
    );
    expect(money(units('0.1', 'BRL') + units('0.2', 'BRL'), 'BRL')).toBe('0.30');
  });
  it('respects zero and three decimal currencies and signed internal totals', () => {
    expect(units('1', 'JPY')).toBe(1n);
    expect(() => units('1.01', 'JPY')).toThrow();
    expect(units('1.123', 'KWD')).toBe(1123n);
    expect(units('-0.50', 'BRL')).toBe(-50n);
    expect(money(-150n, 'BRL')).toBe('-1.50');
  });
  it('validates real dates, positive amounts and effective dates', () => {
    expect(dateSchema.safeParse('2026-02-29').success).toBe(false);
    expect(dateSchema.safeParse('2028-02-29').success).toBe(true);
    expect(
      transactionSchema.safeParse({
        description: 'Test',
        amount: '0',
        categoryId: id,
        dueDate: '2026-10-01',
      }).success,
    ).toBe(false);
    expect(
      transactionSchema.safeParse({
        description: 'Test',
        amount: '1',
        categoryId: id,
        dueDate: '2026-10-01',
        status: 'confirmed',
      }).success,
    ).toBe(false);
    expect(spaceSchema.safeParse({ name: 'X', currency: 'XYZ' }).success).toBe(false);
  });
});
describe('recurrences', () => {
  const r = recurrenceSchema.parse({
    description: 'Aluguel',
    amount: '1200',
    categoryId: id,
    type: 'expense',
    frequency: 'monthly',
    startDate: '2024-01-31',
  });
  it('clamps short months without changing the original day', () => {
    expect([0, 1, 2, 3].map((i) => occurrence(r, i))).toEqual([
      '2024-01-31',
      '2024-02-29',
      '2024-03-31',
      '2024-04-30',
    ]);
  });
  it('handles leap-day annual schedules and custom intervals', () => {
    const annual = { ...r, frequency: 'yearly' as const, startDate: '2024-02-29' };
    expect(occurrence(annual, 1)).toBe('2025-02-28');
    expect(occurrence(annual, 4)).toBe('2028-02-29');
    expect(occurrence({ ...r, interval: 2 }, 1)).toBe('2024-03-31');
  });
  it('handles weekly and daily schedules and bounded ranges', () => {
    expect(occurrence({ ...r, frequency: 'weekly' }, 1)).toBe('2024-02-07');
    expect([...occurrences(r, '2024-02-01', '2024-04-01')]).toEqual(['2024-02-29', '2024-03-31']);
    expect([...occurrences({ ...r, endDate: '2024-02-20' }, '2024-01-01', '2025-01-01')]).toEqual([
      '2024-01-31',
    ]);
  });
  it('uses the space timezone and next-month boundary', () => {
    const now = new Date('2026-01-01T01:00:00Z');
    expect(today('America/Sao_Paulo', now)).toBe('2025-12-31');
    expect(horizon('America/Sao_Paulo', now)).toBe('2026-01-31');
  });
});
describe('investments', () => {
  const i = investmentSchema.parse({
    name: 'Reserva',
    type: 'savings',
    initialBalance: '100',
    startDate: '2026-01-01',
    goal: '200',
  });
  it('adds movements without generating gains and expenses', () => {
    const totals = investmentTotals(
      i,
      [
        { investmentId: id, type: 'deposit', amount: '50', date: '2026-01-02', notes: '' },
        { investmentId: id, type: 'withdrawal', amount: '20', date: '2026-01-03', notes: '' },
      ],
      [],
      'BRL',
    );
    expect(totals).toMatchObject({
      current: '130.00',
      deposits: '150.00',
      withdrawals: '20.00',
      result: '0.00',
      progress: 65,
    });
  });
  it('treats valuations as closing values and adds later movements', () => {
    const ms = [
      { investmentId: id, type: 'deposit' as const, amount: '30', date: '2026-01-02', notes: '' },
      { investmentId: id, type: 'deposit' as const, amount: '10', date: '2026-01-03', notes: '' },
    ];
    const vs = [{ investmentId: id, amount: '140', date: '2026-01-02', notes: '' }];
    expect(investmentTotals(i, ms, vs, 'BRL')).toMatchObject({
      current: '150.00',
      deposits: '140.00',
      result: '10.00',
    });
    expect(investmentTotals(i, ms, vs, 'BRL', '2026-01-01').current).toBe('100.00');
  });
});
describe('investment projections', () => {
  const investment = investmentSchema.parse({
    name: 'CDB',
    type: 'investment',
    product: 'cdb',
    initialBalance: '1000',
    startDate: '2026-01-01',
    maturityDate: '2027-01-01',
    expectedAnnualReturn: 10,
    taxable: true,
    taxRate: 20,
  });
  it('computes compound annual yield and taxes only positive earnings', () => {
    const report = investmentReport(investment, [], [], 'BRL', '2026-01-20');
    expect(report.projection).toEqual({
      maturityDate: '2027-01-01',
      gross: '1100.00',
      earnings: '100.00',
      tax: '20.00',
      net: '1080.00',
    });
    expect(report.current).toBe('1000.00');
    expect(report.history.map((h) => h.date)).toEqual([
      '2026-01-01',
      '2026-01-08',
      '2026-01-15',
      '2026-01-20',
    ]);
    expect(report.forecast.at(-1)?.net).toBe('1080.00');
    for (const product of ['lci', 'lca'] as const)
      expect(
        investmentReport({ ...investment, product, taxable: false }, [], [], 'BRL', '2026-01-20')
          .projection,
      ).toMatchObject({ tax: '0.00', net: '1100.00' });
  });
  it('compounds each deposit only for the time invested and includes withdrawals', () => {
    const movements = [
      { investmentId: id, type: 'deposit' as const, amount: '1000', date: '2026-07-02', notes: '' },
      {
        investmentId: id,
        type: 'withdrawal' as const,
        amount: '200',
        date: '2026-07-02',
        notes: '',
      },
    ];
    expect(
      investmentReport(investment, movements, [], 'BRL', '2026-01-20').projection,
    ).toMatchObject({ gross: '1939.16', earnings: '139.16', tax: '27.83', net: '1911.33' });
  });
  it('uses actual closing valuations as anchors without compounding same-day deposits again', () => {
    const movements = [
      { investmentId: id, type: 'deposit' as const, amount: '100', date: '2026-07-02', notes: '' },
    ];
    const valuations = [{ investmentId: id, amount: '1150', date: '2026-07-02', notes: '' }];
    expect(
      investmentReport(investment, movements, valuations, 'BRL', '2026-07-02').projection,
    ).toMatchObject({ gross: '1206.29', earnings: '106.29', tax: '21.26', net: '1185.03' });
    expect(
      investmentReport(investment, [], [{ ...valuations[0], amount: '500' }], 'BRL', '2026-07-02')
        .projection?.tax,
    ).toBe('0.00');
  });
  it('supports zero yield, exact large principal, currency scales and missing legacy settings', () => {
    expect(
      investmentReport(
        { ...investment, expectedAnnualReturn: 0, initialBalance: '9007199254740993.99' },
        [],
        [],
        'BRL',
        '2026-01-01',
      ).projection,
    ).toMatchObject({ gross: '9007199254740993.99', net: '9007199254740993.99', tax: '0.00' });
    expect(
      investmentReport({ ...investment, initialBalance: '1000.125' }, [], [], 'KWD', '2026-01-01')
        .projection,
    ).toMatchObject({ gross: '1100.138', tax: '20.003', net: '1080.135' });
    expect(
      investmentReport({ ...investment, expectedAnnualReturn: null }, [], [], 'BRL', '2026-01-01')
        .projection,
    ).toBeNull();
    expect(
      investmentReport({ ...investment, maturityDate: null }, [], [], 'BRL', '2026-01-01').forecast,
    ).toEqual([]);
  });
  it('samples quiet weeks, leap days, maturity endpoints and excludes future actual entries', () => {
    expect(weeklyDates('2028-02-22', '2028-03-08')).toEqual([
      '2028-02-22',
      '2028-02-29',
      '2028-03-07',
      '2028-03-08',
    ]);
    expect(weeklyDates('2026-01-20', '2026-01-01')).toEqual([]);
    const report = investmentReport(
      investment,
      [{ investmentId: id, type: 'deposit', amount: '500', date: '2026-02-01', notes: '' }],
      [],
      'BRL',
      '2026-01-15',
    );
    expect(report.current).toBe('1000.00');
    expect(report.history.at(-1)?.current).toBe('1000.00');
    expect(report.projection?.gross).not.toBe('1100.00');
  });
  it('validates tax, yield and maturity inputs while defaulting legacy payloads', () => {
    for (const patch of [
      { taxRate: 101 },
      { taxRate: -1 },
      { taxRate: 0 },
      { expectedAnnualReturn: -1 },
      { maturityDate: '2025-12-31' },
    ])
      expect(investmentSchema.safeParse({ ...investment, ...patch }).success).toBe(false);
    expect(
      investmentSchema.parse({ name: 'Legacy', type: 'savings', startDate: '2026-01-01' }),
    ).toMatchObject({
      product: 'other',
      taxable: false,
      expectedAnnualReturn: null,
      maturityDate: null,
    });
  });
});
describe('encryption and config', () => {
  it('uses random nonces and authenticates contents, record identity and key', () => {
    const key = randomBytes(32);
    const a = encrypt(key, 'record:a', { amount: '987.65', description: 'sensitive' });
    const b = encrypt(key, 'record:a', { amount: '987.65', description: 'sensitive' });
    expect(a.nonce).not.toBe(b.nonce);
    expect(JSON.stringify(a)).not.toContain('sensitive');
    expect(decrypt(key, 'record:a', a)).toEqual({ amount: '987.65', description: 'sensitive' });
    expect(() => decrypt(key, 'record:b', a)).toThrow();
    expect(() => decrypt(randomBytes(32), 'record:a', a)).toThrow();
    expect(() =>
      decrypt(key, 'record:a', { ...a, tag: Buffer.alloc(16).toString('base64') }),
    ).toThrow();
  });
  it('refuses missing keys and HTTP production deployments', () => {
    const env = {
      DATABASE_URL: 'postgres://test',
      MASTER_KEYS: JSON.stringify({ v1: randomBytes(32).toString('base64') }),
      SETUP_TOKEN: 'a'.repeat(32),
    };
    expect(() => readConfig({ ...env, MASTER_KEYS: '{}' })).toThrow();
    expect(() =>
      readConfig({ ...env, NODE_ENV: 'production', PUBLIC_URL: 'http://localhost:3000' }),
    ).toThrow();
    expect(readConfig(env).ACTIVE_MASTER_KEY).toBe('v1');
  });
});

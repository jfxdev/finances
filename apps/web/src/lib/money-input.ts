export function currencyDecimals(currency: string) {
  return (
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

export function acceptsMoneyInput(value: string, decimals: number) {
  return decimals === 0
    ? /^\d*$/.test(value)
    : new RegExp(`^\\d*(?:[.,]\\d{0,${decimals}})?$`).test(value);
}

export function zeroMoneyInput(currency: string) {
  const decimals = currencyDecimals(currency);
  return decimals ? `000,${'0'.repeat(decimals)}` : '000';
}

export function normalizeMoneyInput(value: string) {
  const [whole, fraction = ''] = value.replace(',', '.').split('.');
  const integer = whole.replace(/^0+(?=\d)/, '') || '0';
  return fraction ? `${integer}.${fraction}` : whole ? integer : '';
}

export function FormatPriceToVnd(amount: number): string {
  const formattedNumber = new Intl.NumberFormat("vi-VN").format(amount);
  return `${formattedNumber} VND`;
}

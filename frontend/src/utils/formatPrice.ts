export function formatPrice(
  price: number | string
): string {
  const numericPrice =
    Number(price)

  if (!Number.isFinite(numericPrice)) {
    return '0 ₪'
  }

  const formattedPrice =
    Number.isInteger(numericPrice)
      ? numericPrice.toFixed(0)
      : numericPrice.toFixed(1)

  return `${formattedPrice} ₪`
}
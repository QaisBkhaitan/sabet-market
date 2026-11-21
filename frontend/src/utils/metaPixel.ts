const META_PIXEL_ID = '1492782309443672'

type MetaPixelEvent =
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'

type MetaPixelFunction = (...args: unknown[]) => void

/** Analytics must never interrupt the customer's order. */
export function trackMetaEvent(
  event: MetaPixelEvent,
  parameters: Record<string, unknown>,
  eventId?: string,
): void {
  try {
    if (typeof window === 'undefined') return

    const fbq = (window as Window & { fbq?: MetaPixelFunction }).fbq
    if (typeof fbq !== 'function') return

    if (eventId) {
      fbq('trackSingle', META_PIXEL_ID, event, parameters, { eventID: eventId })
    } else {
      fbq('trackSingle', META_PIXEL_ID, event, parameters)
    }
  } catch {
    // A blocked or unavailable pixel must not prevent the order from completing.
  }
}

export function initializeCheckoutTicket(ticket: EventTicket): CheckoutTicket {
    return {
        ...ticket,
        quantity: 0
    }
}
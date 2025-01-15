export interface Product {
    productId: string;
    name: string;
    description: string;
    quantity?: number
    imageUrl: string;
    inOfStock?: number;
    totalPrice?: number,
    warantyMonths: number;
    priceByDate: number;
    isCustomerPaying: boolean
}
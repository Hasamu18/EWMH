
export const OFFLINE_PAYMENT = "0";
export const ONLINE_PAYMENT = "1";

export type PaymentMethod = {
    value: string;
    text: string;
}

export const PAYMENT_METHODS:PaymentMethod[] = [
    {
        value: OFFLINE_PAYMENT,
        text:"Trực tiếp"
    },
    {
        value: ONLINE_PAYMENT,
        text:"Chuyển khoản"
    }
]
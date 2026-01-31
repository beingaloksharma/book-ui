import { Address } from './user.model';

export interface OrderItem {
    book_id: string;
    title: string;
    quantity: number;
    price: number;
    total: number;
    seller_id: string;
}

export interface Order {
    id: string;
    user_id: string;
    items: OrderItem[];
    total_price: number;
    payment_method: string;
    shipping_address: Address;
    seller_address: Address;
    status: string;
    created_at: string;
}

export interface AddToCartRequest {
    book_id: string;
    user_id: string;
    quantity: number;
    price: number;
}

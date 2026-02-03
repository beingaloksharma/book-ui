export interface Address {
    city: string;
    state: string;
    country: string;
    pincode: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    address: Address[];
    created_at: string;
    updated_at: string;
    username: string;
    status: string;
    type: string;
    password?: string;
    orders: any[]; // Avoid circular dependency or define Order separately
}

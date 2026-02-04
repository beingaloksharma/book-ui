export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
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
    role: string;
    password?: string;
    orders: any[]; // Avoid circular dependency or define Order separately
}

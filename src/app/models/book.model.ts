export interface Book {
    id: string;
    title: string;
    description: string;
    author: string;
    isbn: string;
    language: string[];
    tags: string[];
    page_count: number;
    price: number;
    stock?: number;
    image_url?: string;
    publication_date?: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
    username?: string;
    status: string;
}

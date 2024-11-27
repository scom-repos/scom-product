export interface IShippingInfo {
    id: string;
    name?: string;
    cost: number;
    regions?: string[];
}

export interface IProductInfo {
    id: string;
    stallId: string;
    name: string;
    description?: string;
    images?: string[];
    currency: string;
    price: number;
    quantity: number;
    specs?: string[][];
    shipping?: IShippingInfo[];
    communityUri?: string;
    stallUri?: string;
}
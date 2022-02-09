export interface Stock {
    stockId: string;
    currency: string;
    ric: string;
    bloombergTicker: string;
    bloombergTickerLocal: string;
    name: string;
    country: string;
    price: number;
}

export interface Order {
    orderId: number;
    status: Status;
    side: Side;
    stockCode: string;
    executionMode?: Mode;
    price?: number;
    currency?: string;
    quantity?: number;
    error?: string;
    stock?: Stock;
}

export enum Status {
    NOT_READY = 'Not Ready',
    READY = 'Ready',
    IN_PROGRESS = 'In Progress',
    BOOKED = 'Booked',
    REJECTED = 'Rejected'
}

export enum Side {
    BUY = 'Buy',
    SELL = 'Sell'
}

export enum Mode {
    MARKET = 'Market',
    LIMIT = 'Limit'
}
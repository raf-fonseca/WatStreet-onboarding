// types.ts

export type APIResponse = {
    ticker: string;
    data: StockData[];
    metrics: StockMetrics;
};

export type StockData = {
    timestamp: string;
    price: number;
    volume: number;
};

export type StockMetrics = {
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    marketCap: number;
};

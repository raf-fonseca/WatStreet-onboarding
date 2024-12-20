import { APIResponse } from "@/app/types";

// This function fetches stock data from the API based on the given time range. And returns a promise that resolves to the API response type.
export const fetchStockData = async (
    timerange: "1d" | "1w" | "1m" | "1y"
): Promise<APIResponse> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!API_URL || !API_KEY) {
        throw new Error(
            "API URL or API Key is not defined in environment variables."
        );
    }

    const url = new URL(API_URL);
    url.searchParams.append("timerange", timerange);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            Auth: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch stock data.");
    }

    const data: APIResponse = await response.json(); // convert JSON string to APIresponse type
    return data;
};

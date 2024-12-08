import TimeRange from "@/components/TimeRange";
import { Button } from "@/components/ui/button";
import { fetchStockData } from "@/utils/api";

export default async function Home() {
    const stockData = await fetchStockData("1d");

    console.log(stockData);
    return <TimeRange />;
}

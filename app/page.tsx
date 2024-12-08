import { fetchStockData } from "@/utils/api";

export default async function Home() {
    const stockData = await fetchStockData("1d");

    console.log(stockData);
    return <div className="">;alisldfajsfds</div>;
}

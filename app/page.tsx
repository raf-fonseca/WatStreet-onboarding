import LinePlot from "@/components/LinePlot";
import TimeRange from "@/components/TimeRange";
import { fetchStockData } from "@/utils/api";

interface HomeProps {
    searchParams: {
        timerange?: "1d" | "1w" | "1m" | "1y";
    };
}

const Home = async ({ searchParams }: HomeProps) => {
    const params = await searchParams;
    const timerange = params.timerange || "1d";
    const stockData = await fetchStockData(timerange);
    // console.log(stockData);

    return (
        <div className="flex flex-col items-center justify-center py-16 ">
            <TimeRange />
            <LinePlot data={stockData.data} timerange={timerange} />
        </div>
    );
};

export default Home;

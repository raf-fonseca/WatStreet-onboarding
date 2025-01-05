import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { HoverData, StockMetrics } from "@/app/types";
import Image from "next/image";

interface AppSidebarProps {
    metrics?: StockMetrics;
    hoverData?: HoverData | null;
}

const AppSidebar = ({ hoverData, metrics }: AppSidebarProps) => {
    if (!metrics) {
        return (
            <Sidebar className="text-[#a3a3a3]">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <div className="border-[1px] rounded-xl p-2">
                                <div className="text-center text-red-500">
                                    Error loading market data
                                </div>
                            </div>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        );
    }
    return (
        <Sidebar>
            <SidebarContent className="py-4 px-4 text-[#a3a3a3] gap-4">
                <SidebarGroup className="border-[1px] rounded-xl p-2">
                    <SidebarGroupContent>
                        <div className="flex flex-row items-center gap-2">
                            <div className="text-2xl font-bold text-[#ffffff] ">
                                ${metrics.currentPrice}
                            </div>
                            <div className="mt-[8px] ">USD</div>
                        </div>
                        <div className="mt-2 flex flex-row justify-between">
                            <div>Day High </div>
                            <div className="font-bold">${metrics.dayHigh}</div>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div>Day Low </div>
                            <div className="font-bold">${metrics.dayLow}</div>
                        </div>
                        <div className=" flex flex-row justify-between">
                            <div>Previous Close </div>
                            <div className="font-bold">
                                ${metrics.previousClose}
                            </div>
                        </div>
                        <div className=" flex flex-row justify-between">
                            <div>Volume </div>
                            <div className="font-bold">
                                ${(metrics.volume / 1000000).toFixed(2)} M
                            </div>
                        </div>
                        <div className=" flex flex-row justify-between">
                            <div>Market Cap</div>
                            <div className="font-bold">
                                $
                                {(metrics.marketCap / 1000000000000).toFixed(2)}
                                T
                            </div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="text-[#a3a3a3] p-0">
                    <SidebarGroupContent>
                        <div className="font-bold mb-2">News</div>
                        <div className="gap-2 flex flex-col">
                            <a
                                href="https://finance.yahoo.com/news/apple-smartphone-peers-lose-ground-093000184.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity bg-zinc-800 flex flex-row items-center justify-between p-2 rounded-xl gap-2 border-[1px] border-zinc-800"
                            >
                                <div className="text-xs">
                                    Apple smartphone peers lose ground in China
                                    market amid Huawei comeback
                                </div>
                                <Image
                                    src="/news_1.webp"
                                    width={70}
                                    height={70}
                                    alt="News Image"
                                    className="rounded-xl w-[80px] h-[80px] object-cover"
                                />
                            </a>
                            <a
                                href="https://finance.yahoo.com/news/app-store-revenue-lifts-apples-194353975.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity bg-zinc-800 flex flex-row items-center justify-between p-2 rounded-xl gap-2 border-[1px] border-zinc-800"
                            >
                                <div className="text-xs">
                                    Apple App Store sees 13% growth in December,
                                    15% growth in Q1
                                </div>
                                <Image
                                    src="/news_2.jpg"
                                    width={70}
                                    height={70}
                                    alt="App store"
                                    className="rounded-xl w-[80px] h-[80px] object-cover"
                                />
                            </a>
                            <a
                                href="https://www.aol.com/news/tim-cook-must-pull-off-083002699.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity bg-zinc-800 flex flex-row items-center justify-between p-2 rounded-xl gap-2 border-[1px] border-zinc-800"
                            >
                                <div className="text-xs">
                                    Tim cook faces risky balancing act to
                                    protect Apple's supply chain
                                </div>
                                <Image
                                    src="/news_3.jpeg"
                                    width={80}
                                    height={80}
                                    alt="News Image"
                                    className="rounded-xl w-[80px] h-[80px] object-cover"
                                />
                            </a>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        {hoverData && (
                            <div className="border-[1px] rounded-xl p-2">
                                <div>
                                    <div className="font-bold">
                                        {hoverData.timestamp.toLocaleString()}
                                    </div>
                                    <div>${hoverData.price.toFixed(2)}</div>
                                </div>
                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;

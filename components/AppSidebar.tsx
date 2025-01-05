import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { HoverData, StockMetrics } from "@/app/types";

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
        <Sidebar className="text-[#a3a3a3]">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="border-[1px] rounded-xl p-2 text-[#a3a3a3]">
                            <div className="flex flex-row items-center gap-1">
                                <div className="text-2xl font-bold text-[#ffffff] ">
                                    ${metrics.currentPrice}
                                </div>
                                <div className="mt-[8px]">USD</div>
                            </div>
                            <div className="mt-2 flex flex-row justify-between">
                                <div>Day High </div>
                                <div className="font-bold">
                                    ${metrics.dayHigh}
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
                                <div>Day Low </div>
                                <div className="font-bold">
                                    ${metrics.dayLow}
                                </div>
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
                                    {(
                                        metrics.marketCap / 1000000000000
                                    ).toFixed(2)}
                                    T
                                </div>
                            </div>
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

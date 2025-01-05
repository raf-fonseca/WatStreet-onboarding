import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import { HoverData } from "@/app/types";

interface AppSidebarProps {
    hoverData?: HoverData | null;
}

const AppSidebar = ({ hoverData }: AppSidebarProps) => {
    return (
        <Sidebar className="text-[#a3a3a3]">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="border-[1px] rounded-xl p-2 ">
                            Stock metrics go here
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

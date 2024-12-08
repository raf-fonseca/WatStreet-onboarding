"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const TimeRange = () => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    return (
        <div>
            <div className="flex items-center justify-center py-16">
                <div className="flex px-1 py-1 rounded-xl border-[1px] border-color-white ">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="">
                                <div className="text-md font-semibold">
                                    {selectedTime || "Time"}
                                </div>
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => setSelectedTime("1D")}
                            >
                                1D
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSelectedTime("1W")}
                            >
                                1W
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSelectedTime("1M")}
                            >
                                1M
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSelectedTime("1Y")}
                            >
                                1Y
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default TimeRange;

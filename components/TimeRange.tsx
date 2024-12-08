"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TimeRange = () => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const router = useRouter();

    const handleSelect = (time: "1d" | "1w" | "1m" | "1y") => {
        setSelectedTime(time);
        router.push(`/?timerange=${time}`);
    };
    return (
        <div className="flex px-1 py-1 rounded-xl border-[1px] border-color-white ">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="">
                        <div className="text-md font-semibold">
                            {selectedTime?.toUpperCase() || "1D"}
                        </div>
                        <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleSelect("1d")}>
                        1D
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect("1w")}>
                        1W
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect("1m")}>
                        1M
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSelect("1y")}>
                        1Y
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default TimeRange;

"use client";

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
    const times = ["1d", "1w", "1m", "1y"];

    return (
        <div className="flex px-1 py-1 rounded-xl border-[1px] border-color-white gap-2">
            {times.map((time) => (
                <Button
                    key={time}
                    variant="ghost"
                    className={
                        selectedTime === time
                            ? "bg-[#cca404] hover:bg-[#cca404]"
                            : ""
                    }
                    onClick={() => handleSelect(time as any)}
                >
                    <div className="text-md font-semibold">
                        {time.toUpperCase()}
                    </div>
                </Button>
            ))}
        </div>
    );
};

export default TimeRange;

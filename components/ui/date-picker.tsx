"use client"

import * as React from "react"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
    disabledDates?: Date[]
}

export function DatePickerWithRange({
    className,
    date,
    setDate,
    disabledDates = [],
}: DatePickerProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal h-12 rounded-[20px]",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "d MMM yyyy", { locale: pl })} –{" "}
                                    {format(date.to, "d MMM yyyy", { locale: pl })}
                                </>
                            ) : (
                                format(date.from, "d MMM yyyy", { locale: pl })
                            )
                        ) : (
                            <span>Wybierz termin</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-[24px]" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from ?? today}
                        selected={date}
                        onSelect={(newDate) => {
                            if (!newDate) return setDate(undefined);
                            // Prevent selecting a range that covers a disabled date
                            if (newDate.from && newDate.to) {
                                const isOverlap = disabledDates.some(
                                    (disabledDate) =>
                                        disabledDate >= newDate.from! && disabledDate <= newDate.to!
                                );
                                if (isOverlap) return;
                            }
                            setDate(newDate);
                        }}
                        numberOfMonths={2}
                        fromDate={today}
                        disabled={[
                            { before: today },
                            ...disabledDates
                        ]}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

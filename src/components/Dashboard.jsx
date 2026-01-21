import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Calendar } from "@/components/ui/calendar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DialogClose,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";

export const description = "An interactive area chart";

const chartData = [];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
};

export default function ChartAreaInteractive() {
  const date = new Date();
  const [dateRange, setDateRange] = useState({ from: date, to: date });
  const [timeRange, setTimeRange] = useState("90d");
  const processDashboard = () => {};
  const processChartData = () => {
    const data = new Map()
    let records = localStorage.getItem("record");
    if (records) {
      records = JSON.parse(records)
      records.forEach((record) => {
        console.log(record)
        record.details.forEach((detail) => {
          detail.checkList.forEach((check, index) => {
            if (check) {
              const formattedDate = getFormattedDate(record.year, detail.month, index + 1)
              if(data.get(formattedDate)){
                const count = data.get(formattedDate) + 1
                data.set(formattedDate, count)
              } else {
                data.set(formattedDate, 1)
              }
            }})
        })
      })
      for (const date of data.keys()){
        chartData.push({date, Activities: data.get(date)})
      }
    }
  };
  const getFormattedDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };
  processChartData();

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div>
      <div className="justify-items-end m-5">
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button> Select Range </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Select Date Range</DialogTitle>
              </DialogHeader>
              <div className="flex">
                <Input
                  disabled
                  className="ml-3 mr-3"
                  value={new Intl.DateTimeFormat("en-GB").format(
                    new Date(dateRange.from),
                  )}
                ></Input>
                <p className="mt-1">-</p>
                <Input
                  disabled
                  className="ml-3 mr-3"
                  value={new Intl.DateTimeFormat("en-GB").format(
                    new Date(dateRange.to),
                  )}
                ></Input>
              </div>
              <div className="flex">
                <Card className="mx-auto w-fit p-0">
                  <CardContent className="p-0">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2025-01-01")
                      }
                    />
                  </CardContent>
                </Card>
              </div>
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    processDashboard;
                  }}
                >
                  Go
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Area Chart - Interactive</CardTitle>
            <CardDescription>
              Showing total visitors for the last 3 months
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="Activities"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

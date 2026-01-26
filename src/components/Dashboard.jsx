import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Bar,
  BarChart,
  Line,
  LineChart,
} from "recharts";
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
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";

let chartData = [];

const chartConfig = {
  activities: {
    label: "activities",
    color: "Black",
  },
};

export default function Dashboard() {
  const date = new Date();
  const [dateRange, setDateRange] = useState({ from: date, to: date });
  const [filteredData, setFilteredData] = useState(chartData);
  const prepareChartData = () => {
    const data = new Map();
    const recordsRaw = localStorage.getItem("records");
    if (!recordsRaw) return;
    const records = JSON.parse(recordsRaw);
    for (const record of records) {
      for (const detail of record.details) {
        detail.checkList.forEach((check, dayIndex) => {
          const date = getFormattedDate(
            record.year,
            detail.month,
            dayIndex + 1,
          );
          if (check) {
            data.set(date, (data.get(date) || 0) + 1);
          } else {
            data.set(date, 0);
          }
        });
      }
    }
    chartData = Array.from(data, ([date, activities]) => ({
      date,
      activities,
    }));
    setFilteredData(chartData);
  };
  const getFormattedDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  useEffect(() => {
    prepareChartData();
  }, []);
  const processChartData = () => {
    if (dateRange.to && dateRange.from) {
      const filter = [];
      chartData.forEach((dataPoint) => {
        const dataDate = new Date(dataPoint.date);
        if (
          dataDate >= new Date(dateRange.from) &&
          dataDate <= new Date(dateRange.to)
        ) {
          filter.push(dataPoint);
        }
      });
      setFilteredData(filter);
      console.log("Filtered Data:", chartData);
    }
  };

  const periodContent =
    new Intl.DateTimeFormat("en-GB").format(new Date(dateRange.from)) +
    " to " +
    new Intl.DateTimeFormat("en-GB").format(new Date(dateRange.to));

  return (
    <div>
      <div>
        <h1 className="mb-2 text-2xl justify-self-center mt-4">Dashboard</h1>
      </div>
      <div className="w-[15%] justify-self-center">
        <Separator></Separator>
      </div>
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
                    processChartData();
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
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>
              Showing total activities performed from{" "}
              {dateRange.from === dateRange.to ? "all time." : periodContent}
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
                <linearGradient id="fillActivities" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-activities)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-activities)"
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
                dataKey="activities"
                type="natural"
                fill="url(#fillActivities)"
                stroke="var(--color-activities)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Bar Chart</CardTitle>
            <CardDescription>
              Showing total activities performed from{" "}
              {dateRange.from === dateRange.to ? "all time." : periodContent}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
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
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={'activities'} fill={`var(--color-${'activities'})`} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Line Chart</CardTitle>
            <CardDescription>
              Showing total activities performed from{" "}
              {dateRange.from === dateRange.to ? "all time." : periodContent}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
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
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey={'activities'}
                type="monotone"
                stroke={`var(--color-${'activities'})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

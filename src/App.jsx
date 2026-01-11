import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Header from "./components/Header";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

import { Checkbox } from "./components/ui/checkbox";

const activities = ["Sleeping", "Eating", "Training", "Meditation", "Reading"];

export default function App() {
  const [columnType, setColumnType] = useState("weekly");
  const columnData = {
    weekly: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthly: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ],
  };

  return (
    <>
      <Header />
      <div className="justify-items-end m-5">
        <Select onValueChange={setColumnType} defaultValue="weekly">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Activity</TableHead>
            {columnData[columnType].map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity}>
              <TableCell>{activity}</TableCell>
              {
                columnData[columnType].map((col) => {
                  return <TableCell key={col}><Checkbox className="ml-1"></Checkbox></TableCell>;
                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

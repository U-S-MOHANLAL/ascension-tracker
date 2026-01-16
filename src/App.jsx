import constants from "./constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Header from "./components/Header";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Form, FormControl, FormField, FormItem } from "./components/ui/form";
import { useForm } from "react-hook-form";
import DeleteIcon from "./assets/delete-1487-svgrepo-com.svg";

export default function App() {
  const [columnType, setColumnType] = useState("weekly");
  const storage = localStorage.getItem("activities")
    ? localStorage.getItem("activities").split(",")
    : [];
  const [activities, addActivities] = useState(storage);
  const form = useForm({
    defaultValues: {
      activityName: "",
    },
  });

  const getCurrentMonthDays = () => {
    const date = new Date()
    const month = date.getMonth();
    const year = date.getFullYear();
    let currentMonthDays = [...constants.MONTHLY_CALANDER[month]];
    if (month === 1) {
      if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
        currentMonthDays.push(29);
      }
    }
    return currentMonthDays;
  };
  const columnData = useMemo(
    () => ({
      weekly: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      monthly: getCurrentMonthDays(),
    }),
    []
  );

  const onSubmit = (data) => {
    addActivities([...activities, data.activityName]);
    localStorage.setItem("activities", [...activities, data.activityName]);
    form.reset();
  };

  const operateActivity = (value, index, isDelete) => {
    const data = [...activities];
    if (isDelete) {
      data.splice(index, 1);
    } else {
      data[index] = value;
    }
    addActivities(data);
    localStorage.setItem("activities", data);
  };

  return (
    <>
      <Header />
      <div className="justify-items-end m-5">
        <div className="flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mr-4">+ Activity</Button>
            </DialogTrigger>
            <DialogContent className="w-[410px]">
              <DialogTitle>Add Activity</DialogTitle>
              <DialogDescription>
                Please add your activity to track here.
              </DialogDescription>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                  <FormField
                    name="activityName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Activity Name"
                            className="w-[290px]"
                            {...field}
                          ></Input>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="ml-5">
                    Add
                  </Button>
                </form>
              </Form>
              {activities?.map((activity, index) => (
                <div className="flex" key={activity}>
                  <Input
                    className="w-[230px]"
                    defaultValue={activity}
                    key={activity}
                    disabled
                  ></Input>
                  <Button
                    className="w-[48px] ml-3"
                    onClick={() => {
                      operateActivity(undefined, index, true);
                    }}
                  >
                    <img src={DeleteIcon}></img>
                  </Button>
                </div>
              ))}
            </DialogContent>
          </Dialog>
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
              {columnData[columnType].map((col) => {
                return (
                  <TableCell key={col}>
                    <Checkbox></Checkbox>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

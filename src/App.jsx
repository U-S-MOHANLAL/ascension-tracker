import {
  Table,
  TableBody,
  TableCell,
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
import CheckIcon from "./assets/check-svgrepo-com.svg";

export default function App() {
  const [columnType, setColumnType] = useState("weekly");
  const [activities, addActivities] = useState([]);
  const form = useForm({
    defaultValues: {
      activityName: "",
    },
  });
  const columnData = {
    weekly: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthly: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    ],
  };

  const [tempInput, setTempInput] = useState("");

  const onSubmit = (data) => {
    addActivities([...activities, data.activityName]);
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
                    defaultValue={activity}
                    key={activity}
                    onChange={() => {
                      setTempInput(event.target.value);
                    }}
                  ></Input>
                  <Button
                    className="w-[48px] ml-3"
                    onClick={() => {
                      operateActivity(tempInput, index);
                    }}
                  >
                    <img src={CheckIcon}></img>
                  </Button>
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
                    <Checkbox className="ml-1"></Checkbox>
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

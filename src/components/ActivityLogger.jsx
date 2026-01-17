import constants from "../constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import DeleteIcon from "@/assets/delete-1487-svgrepo-com.svg";

export default function ActivityLogger() {
  const dateClass = new Date();
  const currentMonth = dateClass.getMonth()
  const currentYear = dateClass.getFullYear()
  const [columnType, setColumnType] = useState("monthly");
  const storage = JSON.parse(localStorage.getItem("activities"))
    ? JSON.parse(localStorage.getItem("activities"))
    : [];
  const [activities, addActivities] = useState(storage);
  const form = useForm({
    defaultValues: {
      activityName: "",
    },
  });

  let [record, updateRecords] = useState(JSON.parse(localStorage.getItem("record")) ?? {});
  const getCurrentMonthDays = () => {
    let currentMonthDays = [...constants.MONTHLY_CALANDER[currentMonth]];
    if (currentMonth === 1) {
      if ((currentYear % 4 === 0 && currentYear % 100 != 0) || currentYear % 400 === 0) {
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
    localStorage.setItem(
      "activities",
      JSON.stringify([...activities, data.activityName])
    );
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
    localStorage.setItem("activities", JSON.stringify(data));
  };

  const updateRecord = (check, activity, date) => {
    const checkList = [];
    checkList[date - 1] = check;
    if (record.length) {
      const data = [...record]
      const currentYearRecord = data.find(
        (x) => x.year === currentYear
      );
      const currentMonthRecord = currentYearRecord.details.find(
        (x) => x.month === currentMonth && x.activity === activity
      );
      if (currentMonthRecord) {
        currentMonthRecord.checkList[date - 1] = check;
      } else {
        currentYearRecord.details.push({
          month: currentMonth,
          activity,
          checkList,
        });
      }
      updateRecords(data)
    } else {
      updateRecords([
        {
          year: currentYear,
          details: [
            {
              month: currentMonth,
              activity,
              checkList,
            },
          ],
        },
      ])
    }
    localStorage.setItem("record", JSON.stringify(record));
  };

  const checkProvider = useCallback((activity, col) => {
    if (record.length) {
      const currentYearRecord = record.find(
        (x) => x.year === currentYear
      );
      const currentMonthRecord = currentYearRecord.details.find(
        (x) => x.month === currentMonth && x.activity === activity
      );
      if (currentMonthRecord) {
        return currentMonthRecord.checkList[col - 1];
      }
    }
  }, [record]);

  return (
    <>
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
          <Select onValueChange={setColumnType} defaultValue="monthly">
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
                    <Checkbox
                      checked={checkProvider(activity, col)}
                      onCheckedChange={(val) => {
                        updateRecord(val, activity, col);
                      }}
                    ></Checkbox>
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

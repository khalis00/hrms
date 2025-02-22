import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeaveCalendarProps {
  leaves: Array<{
    id: string;
    employee_name: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    status: string;
  }>;
}

const LeaveCalendar = ({ leaves }: LeaveCalendarProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Create a map of dates to leave requests
  const leaveMap = leaves.reduce(
    (acc, leave) => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const dates = [];
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(leave);
      }
      return acc;
    },
    {} as Record<string, typeof leaves>,
  );

  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md"
        components={{
          DayContent: ({ date }) => {
            const dateStr = date.toISOString().split("T")[0];
            const dayLeaves = leaveMap[dateStr] || [];

            return (
              <div className="relative w-full h-full">
                <div>{date.getDate()}</div>
                {dayLeaves.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {dayLeaves.length}
                    </Badge>
                  </div>
                )}
              </div>
            );
          },
        }}
      />
    </Card>
  );
};

export default LeaveCalendar;

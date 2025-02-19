import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { supabase } from "@/lib/supabase";

type Activity = {
  id: string;
  type: "new_hire" | "payroll" | "position_update" | "department_update";
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
};

interface ActivitiesFeedProps {
  activities?: Activity[];
}

const getActivityColor = (type: Activity["type"]) => {
  const colors = {
    new_hire: "bg-green-100 text-green-800",
    payroll: "bg-blue-100 text-blue-800",
    position_update: "bg-purple-100 text-purple-800",
    department_update: "bg-orange-100 text-orange-800",
  };
  return colors[type];
};

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
          <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">{activity.title}</h4>
            <Badge
              variant="secondary"
              className={getActivityColor(activity.type)}
            >
              {activity.type.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(activity.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const ActivitiesFeed = ({
  activities: initialActivities,
}: ActivitiesFeedProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchActivities = async () => {
      const { data } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        const formattedActivities: Activity[] = data.map((employee) => ({
          id: employee.id,
          type: "new_hire",
          title: "New Employee Hired",
          description: `${employee.full_name} joined as ${employee.position}`,
          timestamp: employee.created_at,
          user: {
            name: "HR Manager",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hr1",
          },
        }));
        setActivities(formattedActivities);
      }
    };

    fetchActivities();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("employees")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "employees" },
        (payload) => {
          const newEmployee = payload.new;
          const newActivity: Activity = {
            id: newEmployee.id,
            type: "new_hire",
            title: "New Employee Hired",
            description: `${newEmployee.full_name} joined as ${newEmployee.position}`,
            timestamp: newEmployee.created_at,
            user: {
              name: "HR Manager",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hr1",
            },
          };
          setActivities((prev) => [newActivity, ...prev]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Card className="h-full bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="divide-y">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ActivitiesFeed;

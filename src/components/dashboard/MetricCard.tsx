import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  color: "blue" | "purple" | "orange" | "green";
  icon?: React.ReactNode;
}

const colorVariants = {
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  orange: "bg-orange-100 text-orange-800",
  green: "bg-green-100 text-green-800",
};

const MetricCard = ({
  title = "Metric Title",
  value = "0",
  change = 0,
  color = "blue",
  icon,
}: MetricCardProps) => {
  const isPositive = change >= 0;
  const changeAbsolute = Math.abs(change);

  return (
    <Card
      className={`w-full h-[180px] ${colorVariants[color]} transition-all hover:scale-105`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">{title}</h3>
          {icon && <div className="text-2xl">{icon}</div>}
        </div>

        <div className="space-y-2">
          <p className="text-3xl font-bold">{value}</p>

          <div className="flex items-center space-x-2">
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {changeAbsolute}% from last period
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

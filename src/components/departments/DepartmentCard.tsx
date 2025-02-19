import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: string;
  employeeCount: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

const DepartmentCard = ({
  id,
  name,
  description,
  icon,
  status = "active",
  employeeCount,
  onEdit,
  onDelete,
  onStatusChange,
}: DepartmentCardProps) => {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg",
        status === "inactive" && "opacity-75",
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(id)}>
                Edit Department
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(id, "active")}>
                Set as Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(id, "inactive")}>
                Set as Inactive
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {employeeCount} {employeeCount === 1 ? "Employee" : "Employees"}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={status === "inactive" ? "bg-gray-100" : ""}
          >
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;

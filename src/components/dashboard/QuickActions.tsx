import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, Upload, FileBarChart, Settings } from "lucide-react";
import AddEmployeeDialog from "./AddEmployeeDialog";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    icon: <UserPlus className="h-5 w-5" />,
    label: "Add New Employee",
    onClick: () => {}, // Will be overridden
  },
  {
    icon: <Upload className="h-5 w-5" />,
    label: "Import Data",
    onClick: () => console.log("Import Data clicked"),
  },
  {
    icon: <FileBarChart className="h-5 w-5" />,
    label: "Generate Report",
    onClick: () => console.log("Generate Report clicked"),
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "System Settings",
    onClick: () => console.log("System Settings clicked"),
  },
];

const QuickActions = ({ actions = defaultActions }: QuickActionsProps) => {
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);

  // Override the Add New Employee action
  const actualActions = actions.map((action) =>
    action.label === "Add New Employee"
      ? { ...action, onClick: () => setAddEmployeeOpen(true) }
      : action,
  );

  return (
    <>
      <AddEmployeeDialog
        open={addEmployeeOpen}
        onOpenChange={setAddEmployeeOpen}
      />
      <Card className="p-6 bg-white w-full h-full">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-col gap-3">
          {actualActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start gap-3 text-left h-12"
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </Card>
    </>
  );
};

export default QuickActions;

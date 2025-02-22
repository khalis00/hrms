import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  Users,
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  LogOut,
} from "lucide-react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  adminOnly?: boolean;
}

interface SidebarProps {
  className?: string;
}

const defaultItems: SidebarItem[] = [
  {
    icon: <Users className="w-5 h-5" />,
    label: "Employees",
    href: "/employees",
    adminOnly: true,
  },
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: "Positions",
    href: "/positions",
    adminOnly: true,
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Departments",
    href: "/departments",
    adminOnly: true,
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    label: "Payroll",
    href: "/payroll",
    adminOnly: true,
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Documents",
    href: "/documents",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    label: "Leave Management",
    href: "/leave",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Reports",
    href: "/reports",
    adminOnly: true,
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    href: "/settings",
    adminOnly: true,
  },
];

const Sidebar = ({ className }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filteredItems = defaultItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  return (
    <div
      className={cn(
        "w-[280px] h-full bg-white border-r p-4 flex flex-col",
        className,
      )}
    >
      <button
        onClick={() => navigate("/")}
        className="mb-8 px-4 hover:opacity-80 transition-opacity"
      >
        <h1 className="text-2xl font-bold">HRMS</h1>
      </button>

      <nav className="flex-1">
        <ul className="space-y-2">
          {filteredItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full text-left",
                  location.pathname === item.href &&
                    "bg-gray-100 text-gray-900",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

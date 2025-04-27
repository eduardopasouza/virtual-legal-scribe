
import { NavLink } from "react-router-dom";
import { Home, User, Users, Calendar, FileText, Settings, BookText, Search, FolderArchive, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  isCollapsed?: boolean;
}

const SidebarNav = ({ isCollapsed }: SidebarNavProps) => {
  const navigationItems = [
    { to: "/", icon: <Home className="mr-2 h-4 w-4" />, label: "Home" },
    { to: "/cases", icon: <FileText className="mr-2 h-4 w-4" />, label: "Casos" },
    { to: "/clients", icon: <Users className="mr-2 h-4 w-4" />, label: "Clientes" },
    { to: "/calendar", icon: <Calendar className="mr-2 h-4 w-4" />, label: "Calendário" },
    { to: "/documents", icon: <FolderArchive className="mr-2 h-4 w-4" />, label: "Documentos" },
    { to: "/search", icon: <Search className="mr-2 h-4 w-4" />, label: "Busca" },
    { to: "/stats", icon: <BookText className="mr-2 h-4 w-4" />, label: "Estatísticas" },
    { to: "/integrations", icon: <Activity className="mr-2 h-4 w-4" />, label: "Integrações" },
    { to: "/settings", icon: <Settings className="mr-2 h-4 w-4" />, label: "Configurações" },
  ];

  return (
    <nav className="grid items-start px-4 text-sm font-medium">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              isActive
                ? "bg-evji-primary-light text-primary-foreground"
                : "transparent"
            )
          }
          end
        >
          {item.icon}
          {isCollapsed ? null : item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;

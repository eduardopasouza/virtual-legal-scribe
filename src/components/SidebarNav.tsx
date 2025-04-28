
import { NavLink } from "react-router-dom";
import { Home, Users, Calendar, FileText, Settings, BookText, Search, FolderArchive, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  isCollapsed?: boolean;
}

const SidebarNav = ({ isCollapsed }: SidebarNavProps) => {
  const navigationItems = [
    { to: "/", icon: <Home className="h-4 w-4" />, label: "Home" },
    { to: "/cases", icon: <FileText className="h-4 w-4" />, label: "Casos" },
    { to: "/clients", icon: <Users className="h-4 w-4" />, label: "Clientes" },
    { to: "/calendar", icon: <Calendar className="h-4 w-4" />, label: "Calendário" },
    { to: "/documents", icon: <FolderArchive className="h-4 w-4" />, label: "Documentos" },
    { to: "/search", icon: <Search className="h-4 w-4" />, label: "Busca" },
    { to: "/stats", icon: <BookText className="h-4 w-4" />, label: "Estatísticas" },
    { to: "/integrations", icon: <Activity className="h-4 w-4" />, label: "Integrações" },
    { to: "/settings", icon: <Settings className="h-4 w-4" />, label: "Configurações" },
  ];

  return (
    <nav className={`grid items-start px-2 pt-4 text-sm font-medium ${isCollapsed ? 'gap-1' : 'gap-2'}`}>
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              `flex ${isCollapsed ? 'flex-col justify-center' : 'items-center'} ${isCollapsed ? 'py-2 px-1' : 'px-3 py-2'} gap-2 rounded-lg text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50`,
              isActive
                ? "bg-primary text-primary-foreground"
                : "transparent"
            )
          }
          end
        >
          <div className={`${isCollapsed ? 'text-center' : ''}`}>
            {item.icon}
          </div>
          {!isCollapsed && <span>{item.label}</span>}
          {isCollapsed && <span className="text-[9px] mt-1">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default SidebarNav;

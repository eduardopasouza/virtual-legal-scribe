
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

interface RouteMap {
  [key: string]: {
    label: string;
    parent?: string;
  };
}

export function NavigationBreadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Map of routes to their human-readable labels
  const routeMap: RouteMap = {
    'cases': { label: 'Casos', parent: '/' },
    'casos': { label: 'Casos', parent: '/' }, // Handle legacy path
    'novo-caso': { label: 'Novo Caso', parent: '/' },
    'clients': { label: 'Clientes', parent: '/' },
    'stats': { label: 'Estatísticas', parent: '/' },
    'calendar': { label: 'Calendário', parent: '/' },
    'settings': { label: 'Configurações', parent: '/' },
    'search': { label: 'Busca', parent: '/' },
    'history': { label: 'Histórico', parent: '/' },
    'webchat': { label: 'Web Chat', parent: '/' },
    'list': { label: 'Lista', parent: '/cases' },
  };

  // Handle case IDs - they would be nested under 'cases' or 'casos'
  if ((pathSegments[0] === 'cases' || pathSegments[0] === 'casos') && 
      pathSegments.length > 1 && 
      pathSegments[1] !== 'list') {
    const caseId = pathSegments[1];
    const parentPath = pathSegments[0] === 'casos' ? '/cases/list' : '/cases/list';
    routeMap[caseId] = { label: `Caso ${caseId.slice(0, 8)}`, parent: parentPath };
  }

  // Build breadcrumb items
  const breadcrumbItems = [];
  let currentPath = '';

  // Always start with home
  breadcrumbItems.push(
    <BreadcrumbItem key="home">
      <BreadcrumbLink asChild>
        <Link to="/">
          <Home className="h-4 w-4" />
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );

  // Add separator after home
  breadcrumbItems.push(
    <BreadcrumbSeparator key="home-separator" />
  );

  // Add remaining path segments
  pathSegments.forEach((segment, index) => {
    // Handle the legacy 'casos' path
    if (segment === 'casos' && index === 0) {
      segment = 'cases';
    }
    
    currentPath += `/${segment}`;
    
    // Skip 'list' in URLs like /cases/list as it's redundant
    if (segment === 'list' && index > 0 && (pathSegments[index - 1] === 'cases' || pathSegments[index - 1] === 'casos')) {
      return;
    }

    const isLast = index === pathSegments.length - 1;
    const info = routeMap[segment];
    
    if (info) {
      if (isLast) {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbPage>{info.label}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      } else {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbLink asChild>
              <Link to={currentPath}>{info.label}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
        breadcrumbItems.push(
          <BreadcrumbSeparator key={`${segment}-separator`} />
        );
      }
    }

    // For case IDs and other dynamic segments
    else if ((pathSegments[0] === 'cases' || pathSegments[0] === 'casos') && index === 1) {
      const correctPath = `/cases/${segment}`;
      
      if (isLast) {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbPage>Caso {segment.slice(0, 8)}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      } else {
        breadcrumbItems.push(
          <BreadcrumbItem key={segment}>
            <BreadcrumbLink asChild>
              <Link to={correctPath}>Caso {segment.slice(0, 8)}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
        breadcrumbItems.push(
          <BreadcrumbSeparator key={`${segment}-separator`} />
        );
      }
    }
  });

  // Get current page title from query params if searching
  if (location.pathname === '/search' && location.search) {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      breadcrumbItems.push(
        <BreadcrumbItem key="search-query">
          <BreadcrumbPage>Resultados para "{query}"</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}

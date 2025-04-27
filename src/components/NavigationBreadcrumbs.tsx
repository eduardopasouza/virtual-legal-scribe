
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface NavigationBreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function NavigationBreadcrumbs({ items = [] }: NavigationBreadcrumbsProps) {
  const breadcrumbItems = [];

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
  if (items.length > 0) {
    breadcrumbItems.push(
      <BreadcrumbSeparator key="home-separator" />
    );
  }

  // Add custom items
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;

    if (isLast) {
      breadcrumbItems.push(
        <BreadcrumbItem key={item.href}>
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <BreadcrumbItem key={item.href}>
          <BreadcrumbLink asChild>
            <Link to={item.href}>{item.label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      breadcrumbItems.push(
        <BreadcrumbSeparator key={`${item.href}-separator`} />
      );
    }
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}

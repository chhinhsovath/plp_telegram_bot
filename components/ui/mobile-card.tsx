import { cn } from "@/lib/utils";
import { Card } from "./card";

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileCard({ className, children, ...props }: MobileCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden",
        "transition-all duration-200",
        "hover:shadow-lg",
        // Mobile-specific styles
        "mx-0 sm:mx-0", // No margin on mobile
        "rounded-lg sm:rounded-lg", // Consistent border radius
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
}

export function MobileCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "p-4 sm:p-6",
        className
      )} 
      {...props} 
    />
  );
}

export function MobileCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "p-4 sm:p-6 pt-0 sm:pt-0",
        className
      )} 
      {...props} 
    />
  );
}
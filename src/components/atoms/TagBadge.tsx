import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  label: string;
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'default';
  className?: string;
  icon?: React.ReactNode;
}

export function TagBadge({ label, variant = 'default', className, icon }: TagBadgeProps) {
  const variants = {
    default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    green: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
    orange: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <Badge variant="secondary" className={cn("font-medium", variants[variant], className)}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </Badge>
  );
}

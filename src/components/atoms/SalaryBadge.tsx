import { Badge } from "@/components/ui/badge";
import { Vacancy } from "@/types";

export function SalaryBadge({ salary }: { salary: Vacancy["salary"] }) {
  const formatMoney = (val: number) => {
    return val.toLocaleString("ru-KZ");
  };

  if (!salary) return <Badge variant="outline" className="text-muted-foreground whitespace-nowrap bg-card">Келісім бойынша</Badge>;

  if (salary.max) {
    return (
      <Badge variant="outline" className="font-heading font-bold text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 whitespace-nowrap">
        {formatMoney(salary.min)} - {formatMoney(salary.max)} ₸
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="font-heading font-bold text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20 whitespace-nowrap">
      {formatMoney(salary.min)} ₸ бастап
    </Badge>
  );
}

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Expense } from "@/types/expense";

interface RecentExpenseProps {
  data: Expense[];
}

export function RecentExpenses({ data }: RecentExpenseProps) {
  const total = data
    .reduce((acc, data) => acc + parseFloat(data.amount), 0)
    .toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent expenses</CardTitle>
        <CardDescription>You spent {total} Rs this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 min-h-[200px] w-full">
          {data
            .sort((a: Expense, b: Expense) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 5)
            .map((expense) => (
              <div key={expense.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{expense.category.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.name}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(parseFloat(expense.amount))}
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

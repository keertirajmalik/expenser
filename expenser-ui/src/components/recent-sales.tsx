import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiRequest } from "@/lib/apiRequest";
import { Expense } from "@/types/expense";
import { useEffect, useState } from "react";

const fetchExpenses = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
) => {
  apiRequest("/cxf/transaction", "GET").then((response) => {
    response.json().then((data) => {
      if (Array.isArray(data.transactions)) {
        //sort basedon the date

        setExpenses(data.transactions);
      }
    });
  });
};

export function RecentSales() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  useEffect(() => {
    fetchExpenses(setExpenses);
  }, []);

  const total = expenses
    .reduce((acc, expense) => acc + parseFloat(expense.amount), 0)
    .toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent expenses</CardTitle>
        <CardDescription>You spent {total} Rs this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses
            .sort((a: Expense, b: Expense) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 5)
            .map((expense) => (
              <div key={expense.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>{expense.type.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.name}
                  </p>
                </div>
                <div className="ml-auto font-medium">{expense.amount}</div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

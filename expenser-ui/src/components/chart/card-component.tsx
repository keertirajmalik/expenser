import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Investment } from "@/types/investment";
import { ReactElement } from "react";

interface CardComponentProps {
  data: Expense[] | Income[] | Investment[];
  title: string;
  icon: ReactElement;
}

export function CardComponent({ data, title, icon }: CardComponentProps) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  const total = formatter.format(
    data.reduce((acc, data) => acc + parseFloat(data.amount), 0)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <CardTitle>{title}</CardTitle>
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[50px] w-full font-bold">
        {total}
      </CardContent>
    </Card>
  );
}

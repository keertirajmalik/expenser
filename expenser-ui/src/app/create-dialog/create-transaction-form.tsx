import { CategoryForm } from "@/app/create-dialog/category-form";
import { ExpenseForm } from "@/app/create-dialog/expense-form";
import { IncomeForm } from "@/app/create-dialog/income-form";
import { InvestmentForm } from "@/app/create-dialog/investment-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCategoryMutation } from "@/hooks/use-category-query";
import { useCreateExpenseMutation } from "@/hooks/use-expense-query";
import { useCreateIncomeMutation } from "@/hooks/use-income-query";
import { useCreateInvestmentMutation } from "@/hooks/use-investment-query";
import { CategoryFormSchema } from "@/types/form-schema/category";
import {
  TransactionFormSchema,
  TransactionFormValues,
} from "@/types/form-schema/transaction";
import { TransactionType } from "@/types/transaction";
import { useState } from "react";
import { z } from "zod";

interface CreateTransactionFormProps {
  creation: TransactionType;
  initialData?: TransactionFormValues;
  onCompleted?: () => void;
  onCancel?: () => void;
}

export function CreateTransactionForm({
  creation,
  initialData,
  onCompleted,
  onCancel,
}: CreateTransactionFormProps) {
  const [transactionType, setTransactionType] = useState(creation);

  const createExpenseMutation = useCreateExpenseMutation();
  const createCategoryMutation = useCreateCategoryMutation();
  const createInvestmentMutation = useCreateInvestmentMutation();
  const createIncomeMutation = useCreateIncomeMutation();

  const onExpenseSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
    createExpenseMutation.mutate(data, {
      onSuccess: () => {
        onCompleted?.();
      },
    });
  };

  const onCategorySubmit = (data: z.infer<typeof CategoryFormSchema>) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        onCompleted?.();
      },
    });
  };

  const onInvestmentSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
    createInvestmentMutation.mutate(data, {
      onSuccess: () => {
        onCompleted?.();
      },
    });
  };

  const onIncomeSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
    createIncomeMutation.mutate(data, {
      onSuccess: () => {
        onCompleted?.();
      },
    });
  };

  let title: string;
  let description: string;
  let defaultValue: string | undefined;
  let formComponent: React.ReactNode;

  switch (transactionType) {
    case TransactionType.Category:
      title = "Create Category";
      description = "Provide information regarding category.";
      defaultValue = undefined;
      formComponent = <CategoryForm onSubmit={onCategorySubmit} />;
      break;

    case TransactionType.Expense:
      title = "Create Expense";
      description = "Provide information regarding your expense.";
      defaultValue = "expense";
      formComponent = (
        <ExpenseForm onSubmit={onExpenseSubmit} initialData={initialData} />
      );
      break;

    case TransactionType.Investment:
      title = "Create Investment";
      description = "Provide information regarding your investment.";
      defaultValue = "investment";
      formComponent = (
        <InvestmentForm
          onSubmit={onInvestmentSubmit}
          initialData={initialData}
        />
      );
      break;

    case TransactionType.Income:
      title = "Create Income";
      description = "Provide information regarding your income.";
      defaultValue = "income";
      formComponent = (
        <IncomeForm onSubmit={onIncomeSubmit} initialData={initialData} />
      );
      break;

    default:
      title = "Select transaction type";
      description = "Provide information regarding your transaction.";
      defaultValue = "";
      formComponent = null;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {creation !== TransactionType.Category && (
        <div className="space-y-2">
          <Label required className="pb-1">
            Transaction type
          </Label>
          <Select
            defaultValue={defaultValue}
            onValueChange={(value) => {
              if (value === "income")
                setTransactionType(TransactionType.Income);
              if (value === "expense")
                setTransactionType(TransactionType.Expense);
              if (value === "investment")
                setTransactionType(TransactionType.Investment);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Transaction type</SelectLabel>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {formComponent}
      <Button
        type="button"
        className="w-full"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}

import {
  CategoryForm,
  CategoryFormSchema,
} from "@/app/create-dialog/category-form";
import { ExpenseForm } from "@/app/create-dialog/expense-form";
import { IncomeForm } from "@/app/create-dialog/income-form";
import { InvestmentForm } from "@/app/create-dialog/investment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { TransactionFormSchema } from "@/types/transaction-form-schema";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface CreateDialogProps {
  creation: "Expense" | "Category" | "Investment" | "Income" | "Transaction";
  initialData?: typeof TransactionFormSchema | typeof CategoryFormSchema;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode; // Optional custom trigger
}

export function CreateDialog({
  creation: creationCategory,
  initialData,
  open: controlledOpen,
  onOpenChange,
  trigger,
}: CreateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled open if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [transactionType, setTransacationType] = useState(creationCategory);
  const buttonName = creationCategory;

  const createExpenseMutation = useCreateExpenseMutation();
  const onExpenseSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
    createExpenseMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const createCategoryMutation = useCreateCategoryMutation();
  const onCategorySubmit = (data: z.infer<typeof CategoryFormSchema>) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const createInvestmentMutation = useCreateInvestmentMutation();
  const onInvestmentSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
    createInvestmentMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const createIncomeMutation = useCreateIncomeMutation();
  const onIncomeSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
    createIncomeMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  let formComponent;
  let title;
  let description;
  let defaultValue;

  switch (transactionType) {
    case "Category":
      title = "Create Expense Category";
      description = "Provide information regarding expense category.";
      formComponent = <CategoryForm onSubmit={onCategorySubmit} />;
      break;

    case "Expense":
      title = "Create Expense";
      description = "Provide information regarding your expense.";
      defaultValue = "expense";
      formComponent = (
        <ExpenseForm
          onSubmit={onExpenseSubmit}
          initialData={
            initialData as z.infer<typeof TransactionFormSchema> | undefined
          }
        />
      );
      break;

    case "Investment":
      title = "Create Investment";
      description = "Provide information regarding your investment.";
      defaultValue = "investment";
      formComponent = (
        <InvestmentForm
          onSubmit={onInvestmentSubmit}
          initialData={
            initialData as z.infer<typeof TransactionFormSchema> | undefined
          }
        />
      );
      break;

    case "Income":
      title = "Create Income";
      description = "Provide information regarding your income.";
      defaultValue = "income";
      formComponent = (
        <IncomeForm
          onSubmit={onIncomeSubmit}
          initialData={
            initialData as z.infer<typeof TransactionFormSchema> | undefined
          }
        />
      );
      break;

    default:
      title = "Select transaction type";
      description = "Provide information regarding your income.";
      formComponent = null;
      defaultValue = "";
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="default">
              <Plus />
              Create {buttonName}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <Label required className="pb-1">
            Transaction type
          </Label>
          {creationCategory !== "Category" && (
            <Select
              defaultValue={defaultValue}
              onValueChange={(value) => {
                if (value === "income") setTransacationType("Income");
                if (value === "expense") setTransacationType("Expense");
                if (value === "investment") setTransacationType("Investment");
              }}
            >
              <SelectTrigger className="w-auto">
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
          )}
        </DialogHeader>
        {formComponent}
      </DialogContent>
    </Dialog>
  );
}

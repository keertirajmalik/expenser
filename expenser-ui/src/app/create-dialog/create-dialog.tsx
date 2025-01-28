import {
  CategoryForm,
  CategoryFormSchema,
} from "@/app/create-dialog/category-form";
import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/app/create-dialog/expense-form";
import {
  InvestmentForm,
  InvestmentFormSchema,
} from "@/app/create-dialog/investment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateCategoryMutation } from "@/hooks/use-category-query";
import { useCreateExpenseMutation } from "@/hooks/use-expense-query";
import { useCreateInvestmentMutation } from "@/hooks/use-investment-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface CreateDialogProps {
  creation: "Expense" | "Category" | "Investment";
  title: string;
  description: string;
}

export function CreateDialog({
  creation: creationCategory,
  title,
  description,
}: CreateDialogProps) {
  const [open, setOpen] = useState(false);

  const createExpenseMutation = useCreateExpenseMutation();
  const onExpenseSubmit = (data: z.infer<typeof ExpenseFormSchema>) => {
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
  const onInvestmentSubmit = (data: z.infer<typeof InvestmentFormSchema>) => {
    createInvestmentMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  let formComponent;
  switch (creationCategory) {
    case "Expense":
      formComponent = <ExpenseForm onSubmit={onExpenseSubmit} />;
      break;
    case "Category":
      formComponent = <CategoryForm onSubmit={onCategorySubmit} />;
      break;
    case "Investment":
      formComponent = <InvestmentForm onSubmit={onInvestmentSubmit} />;
      break;
    default:
      formComponent = null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Create {creationCategory}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{formComponent}</div>
      </DialogContent>
    </Dialog>
  );
}

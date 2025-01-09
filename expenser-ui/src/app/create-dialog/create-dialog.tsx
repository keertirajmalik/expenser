import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/app/create-dialog/expense-form";
import {
  CategoryForm,
  CategoryFormSchema,
} from "@/app/create-dialog/category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateExpenseMutation } from "@/hooks/use-expense-query";
import { useCreateCategoryMutation } from "@/hooks/use-category-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface CreateDialogProps {
  creationCategory: "Expense" | "Category";
  title: string;
  description: string;
}

export function CreateDialog({
  creationCategory,
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
        {creationCategory === "Expense" ? (
          <ExpenseForm onSubmit={onExpenseSubmit} />
        ) : (
          <CategoryForm onSubmit={onCategorySubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}

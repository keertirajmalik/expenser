import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/app/create-dialog/expense-form";
import { TypeForm, TypeFormSchema } from "@/app/create-dialog/type-form";
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
import { useCreateTypeMutation } from "@/hooks/use-type-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface CreateDialogProps {
  creationType: "Expense" | "Type";
  title: string;
  description: string;
}

export function CreateDialog({
  creationType,
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

  const createTypeMutation = useCreateTypeMutation();
  const onTypeSubmit = (data: z.infer<typeof TypeFormSchema>) => {
    createTypeMutation.mutate(data, {
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
          Create {creationType}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {creationType === "Expense" ? (
          <ExpenseForm onSubmit={onExpenseSubmit} />
        ) : (
          <TypeForm onSubmit={onTypeSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}

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
import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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

  const queryClient = useQueryClient();

  const createExpenseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ExpenseFormSchema>) => {
      const expenseData = {
        ...data,
        amount: parseFloat(data.amount),
        date: format(data.date, "dd/MM/yyyy"),
      };

      apiRequest("/cxf/transaction", "POST", expenseData)
        .then((res: Response) => {
          if (!res.ok) {
            throw new Error(`Failed to save expense: ${res.statusText}`);
          }
          setOpen(false);
          showToast("Expense Created", "Expense created successfully.");
          queryClient.invalidateQueries({ queryKey: ["expenses"] });
        })
        .catch((error: Error) => {
          showToast("Expense Creation Failed", error.message, "destructive");
        });
    },
  });

  const createTypeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof TypeFormSchema>) => {
      apiRequest("/cxf/type", "POST", data)
        .then(async (res: Response) => {
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error);
          }
          setOpen(false);
          showToast("Expense Created", "Expense created successfully.");
          queryClient.invalidateQueries({ queryKey: ["types"] });
        })
        .catch((error: Error) => {
          showToast("Expense Creation Failed", error.message, "destructive");
        });
    },
  });

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
          <ExpenseForm onSubmit={createExpenseMutation.mutate} />
        ) : (
          <TypeForm onSubmit={createTypeMutation.mutate} />
        )}
      </DialogContent>
    </Dialog>
  );
}

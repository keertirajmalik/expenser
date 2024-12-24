import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/components/create-dialog/expense-form";
import { TypeForm, TypeFormSchema } from "@/components/create-dialog/type-form";
import { apiRequest } from "@/lib/apiRequest";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface CreateDialogProps {
  creationType: "Expense" | "Type";
  title: string;
  description: string;
  onSuccess: () => void;
}

export function CreateDialog({
  creationType,
  title,
  description,
  onSuccess,
}: CreateDialogProps) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const handleError = (error: Error) => {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    toast.toast({
      title: `${creationType} creation Failed`,
      description: message,
      variant: "destructive",
    });
  };

  function onExpenseFormSubmit(data: z.infer<typeof ExpenseFormSchema>) {
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
        toast.toast({
          description: "Expense created successfully.",
        });
        onSuccess();
      })
      .catch(handleError);
  }

  function onTypeFormSubmit(data: z.infer<typeof TypeFormSchema>) {
    apiRequest("/cxf/type", "POST", data)
      .then(async (res: Response) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error);
        }
        setOpen(false);
        toast.toast({
          description: "Expense type created successfully.",
        });
        onSuccess();
      })
      .catch(handleError);
  }

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
          <ExpenseForm onSubmit={onExpenseFormSubmit} />
        ) : (
          <TypeForm onSubmit={onTypeFormSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}

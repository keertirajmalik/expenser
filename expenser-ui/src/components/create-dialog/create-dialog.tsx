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
  type: "Expense" | "Type";
  title: string;
  description: string;
}

export function CreateDialog({ type, title, description }: CreateDialogProps) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  function onExpenesFormSubmit(data: z.infer<typeof ExpenseFormSchema>) {
    const handleError = (error: Error) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.toast({
        title: "Expense creation Failed",
        description: message,
        variant: "destructive",
      });
    };

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
          description: "Expense saved successfully.",
        });
      })
      .catch(handleError);
  }

  function onTypeFormSubmit(data: z.infer<typeof TypeFormSchema>) {
    const handleError = (error: Error) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.toast({
        title: "Expense type creation Failed",
        description: message,
        variant: "destructive",
      });
    };

    apiRequest("/cxf/type", "POST", data)
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(`Failed to save expense type: ${res.statusText}`);
        }
        setOpen(false);
        toast.toast({
          description: "Expense type create successfully.",
        });
      })
      .catch(handleError);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Create {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {type === "Expense" ? (
          <ExpenseForm onSubmit={onExpenesFormSubmit} />
        ) : (
          <TypeForm onSubmit={onTypeFormSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
}

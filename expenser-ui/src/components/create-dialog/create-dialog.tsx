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
import { ExpenseForm } from "@/components/create-dialog/expense-form";
import { TypeForm } from "@/components/create-dialog/type-form";

interface CreateDialogProps {
  type: "Expense" | "Type";
  title: string;
  description: string;
}

export function CreateDialog({ type, title, description }: CreateDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

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
          <ExpenseForm handleClose={handleClose} />
        ) : (
          <TypeForm handleClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

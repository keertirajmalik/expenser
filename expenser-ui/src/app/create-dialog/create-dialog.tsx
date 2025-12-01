import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TransactionType } from "@/types/transaction";
import { TransactionFormValues } from "@/types/form-schema/transaction";
import { CreateTransactionForm } from "./create-transaction-form"; // path where you put it

interface CreateDialogProps {
  creation: TransactionType;
  initialData?: TransactionFormValues;
  trigger?: React.ReactNode | null;
}

export function CreateDialog({ creation, initialData }: CreateDialogProps) {
  const [open, setOpen] = useState(false);
  const buttonName = creation;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Create {buttonName}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle hidden={true} />
        <DialogDescription hidden={true} />
        <CreateTransactionForm
          creation={creation}
          initialData={initialData}
          onCompleted={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

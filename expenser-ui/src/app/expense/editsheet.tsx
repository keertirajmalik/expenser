import {
  ExpenseFormSchema,
  ExpenseForm,
} from "@/app/create-dialog/expense-form";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Expense } from "@/types/expense";
import { Row } from "@tanstack/react-table";
import { Sheet } from "@/components/ui/sheet";
import { parse } from "date-fns";
import { z } from "zod";
import { Button } from "@/components/ui/button";

interface EditExpenseSheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof ExpenseFormSchema>) => void;
  row: Row<Expense>;
}

export function EditExpenseSheet({
  editSheetOpen,
  setEditSheetOpen,
  onSubmit,
  row,
}: EditExpenseSheetProps) {
  return (
    <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Expense Details</SheetTitle>
          <SheetDescription>
            Make changes to your expense here. Click submit when you're done.
          </SheetDescription>
        </SheetHeader>

        <ExpenseForm
          initialData={{
            name: row.original.name,
            type: row.original.type,
            amount: row.original.amount.toString(),
            date: parse(row.original.date.toString(), "dd/MM/yyyy", new Date()),
            note: row.original.note,
          }}
          onSubmit={onSubmit}
        />
        <Button
          type="reset"
          variant="secondary"
          className="w-full my-4"
          onClick={() => setEditSheetOpen(false)}
        >
          Cancel
        </Button>
      </SheetContent>
    </Sheet>
  );
}

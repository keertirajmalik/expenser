import {
  ExpenseForm,
} from "@/app/create-dialog/expense-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { parseDate } from "@/lib/dateUtil";
import { Expense } from "@/types/expense";
import { TransactionFormSchema } from "@/types/form-schema/transaction";
import { Row } from "@tanstack/react-table";
import { z } from "zod";

interface EditExpenseSheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof TransactionFormSchema>) => void;
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
            category: row.original.category,
            amount: row.original.amount.toString(),
            date: parseDate(row.original.date.toString()),
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

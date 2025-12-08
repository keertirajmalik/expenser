import { IncomeForm } from "@/app/create-dialog/income-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { parseDate } from "@/lib/dateUtil";
import { TransactionFormSchema } from "@/types/form-schema/transaction";
import { Income } from "@/types/income";
import { Row } from "@tanstack/react-table";
import { z } from "zod";

interface EditIncomeSheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof TransactionFormSchema>) => void;
  row: Row<Income>;
}

export function EditIncomeSheet({
  editSheetOpen,
  setEditSheetOpen,
  onSubmit,
  row,
}: EditIncomeSheetProps) {
  return (
    <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Income Details</SheetTitle>
          <SheetDescription>
            Make changes to your income here. Click submit when you're done.
          </SheetDescription>
        </SheetHeader>

        <IncomeForm
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
          type="button"
          variant="secondary"
          className="mx-2"
          onClick={() => setEditSheetOpen(false)}
        >
          Cancel
        </Button>
      </SheetContent>
    </Sheet>
  );
}

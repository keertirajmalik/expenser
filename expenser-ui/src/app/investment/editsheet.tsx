import {
  InvestmentForm,
} from "@/app/create-dialog/investment-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { parseDate } from "@/lib/dateUtil";
import { Investment } from "@/types/investment";
import { TransactionFormSchema } from "@/types/form-schema/transaction";
import { Row } from "@tanstack/react-table";
import { z } from "zod";

interface EditInvestmentSheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof TransactionFormSchema>) => void;
  row: Row<Investment>;
}

export function EditInvestmentSheet({
  editSheetOpen,
  setEditSheetOpen,
  onSubmit,
  row,
}: EditInvestmentSheetProps) {
  return (
    <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Investment Details</SheetTitle>
          <SheetDescription>
            Make changes to your investment here. Click submit when you're done.
          </SheetDescription>
        </SheetHeader>

        <InvestmentForm
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
          className="w-full my-4"
          onClick={() => setEditSheetOpen(false)}
        >
          Cancel
        </Button>
      </SheetContent>
    </Sheet>
  );
}

import {
  InvestmentForm,
  InvestmentFormSchema,
} from "@/app/create-dialog/investment-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Investment } from "@/types/investment";
import { Row } from "@tanstack/react-table";
import { parse } from "date-fns";
import { z } from "zod";

interface EditInvestmentSheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof InvestmentFormSchema>) => void;
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
            date: (() => {
              try {
                return parse(
                  row.original.date.toString(),
                  "dd/MM/yyyy",
                  new Date(),
                );
              } catch (error) {
                console.error("Failed to parse date:", error);
                return new Date();
              }
            })(),
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

import { TypeFormSchema, TypeForm } from "@/app/create-dialog/type-form";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "@/components/ui/sheet";
import { Type } from "@/types/expenseType";
import { Row } from "@tanstack/react-table";
import { z } from "zod";

interface EditTypeSheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof TypeFormSchema>) => void;
  row: Row<Type>;
}

export function EditTypeSheet({
  editSheetOpen,
  setEditSheetOpen,
  onSubmit,
  row,
}: EditTypeSheetProps) {
  return (
    <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Expese Details</SheetTitle>
          <SheetDescription>
            Make changes to your expense here. Click submit when you're done.
          </SheetDescription>
        </SheetHeader>

        <TypeForm
          onSubmit={onSubmit}
          initialData={{
            name: row.original.name,
            description: row.original.description,
          }}
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

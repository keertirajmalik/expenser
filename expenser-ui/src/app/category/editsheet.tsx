import {
  CategoryForm,
  CategoryFormSchema,
} from "@/app/create-dialog/category-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Category } from "@/types/category";
import { Row } from "@tanstack/react-table";
import { z } from "zod";

interface EditCategorySheetProps {
  editSheetOpen: boolean;
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: z.infer<typeof CategoryFormSchema>) => void;
  row: Row<Category>;
}

export function EditCategorySheet({
  editSheetOpen,
  setEditSheetOpen,
  onSubmit,
  row,
}: EditCategorySheetProps) {
  return (
    <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category Details</SheetTitle>
          <SheetDescription>
            Make changes to your category details here. Click submit when you're
            done.
          </SheetDescription>
        </SheetHeader>

        <CategoryForm
          onSubmit={onSubmit}
          initialData={{
            name: row.original.name,
            type: row.original.type,
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

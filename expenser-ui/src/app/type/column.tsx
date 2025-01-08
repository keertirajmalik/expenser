import { TypeForm, TypeFormSchema } from "@/app/create-dialog/type-form";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DeleteDialog } from "@/components/data-table/row-action";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDeleteTypeQuery, useUpdateTypeQuery } from "@/hooks/use-type-query";
import { ExpenseType } from "@/types/expenseType";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const columns: ColumnDef<ExpenseType>[] = [
  {
    id: "id",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [editSheetOpen, setEditSheetOpen] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      const editTypeMutation = useUpdateTypeQuery();
      const onSubmit = (data: z.infer<typeof TypeFormSchema>) => {
        editTypeMutation.mutate({ type: data, id: row.original.id });
        setEditSheetOpen(false);
      };

      const deleteTypeMutation = useDeleteTypeQuery();
      const onDeleteClick = () => {
        deleteTypeMutation.mutate(row.original.id);
        setDeleteDialogOpen(false);
      };

      return (
        <>
          <div className="flex items-center h-8 flex-row gap-4">
            <Pencil
              onClick={() => setEditSheetOpen(true)}
              size="20px"
              strokeWidth="1px"
              className="cursor-pointer"
            />
            <Trash
              onClick={() => setDeleteDialogOpen(true)}
              size="20px"
              color="#EF4444"
              strokeWidth="1px"
              className="cursor-pointer"
            />
          </div>
          {EditTypeSheet(editSheetOpen, setEditSheetOpen, onSubmit, row)}
          <DeleteDialog
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            onDeleteClick={onDeleteClick}
          />
        </>
      );
    },
  },
];

function EditTypeSheet(
  editSheetOpen: boolean,
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onSubmit: (data: z.infer<typeof TypeFormSchema>) => void,
  row: Row<ExpenseType>,
) {
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

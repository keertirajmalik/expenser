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
import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { ExpenseType } from "@/types/expenseType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

      const queryClient = useQueryClient();

      const editTypeMutation = useMutation({
        mutationFn: async (data: z.infer<typeof TypeFormSchema>) => {
          apiRequest(`/cxf/type/${row.original.id}`, "PUT", data)
            .then(async (res: Response) => {
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
              }
              setEditSheetOpen(false);
              queryClient.invalidateQueries({ queryKey: ["types"] });
              showToast("Type Updated", "Type updated successfully.");
            })
            .catch((error: Error) => {
              showToast("Type Update Failed", error.message, "destructive");
            });
        },
      });

      const deleteTypeMutation = useMutation({
        mutationFn: async () => {
          apiRequest(`/cxf/type/${row.original.id}`, "DELETE")
            .then(async (res: Response) => {
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error);
              }
              queryClient.invalidateQueries({ queryKey: ["types"] });
              showToast("Type Deleted", "Type deleted successfully.");
            })
            .catch((error: Error) => {
              showToast("Type Deletion Failed", error.message, "destructive");
            });
        },
      });

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
          {EditTypeSheet(
            editSheetOpen,
            setEditSheetOpen,
            editTypeMutation.mutate,
            row,
          )}
          <DeleteDialog
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            onDeleteClick={deleteTypeMutation.mutate}
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

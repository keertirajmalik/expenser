import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ExpenseType } from "@/types/expenseType";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { TypeForm, TypeFormSchema } from "@/components/create-dialog/type-form";
import { apiRequest } from "@/lib/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { DeleteDialog } from "@/components/data-table/row-action";

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
      const toast = useToast();
      const [editSheetOpen, setEditSheetOpen] = useState(false);
      const [alertDialogOpen, setAlertDialogOpen] = useState(false);

      const handleToast = (
        title: string,
        description: string,
        variant?: "default" | "destructive" | null | undefined,
      ) => {
        toast.toast({
          title: title,
          description: description,
          variant: variant,
        });
      };

      function onSubmit(data: z.infer<typeof TypeFormSchema>) {
        apiRequest(`/cxf/type/${row.original.id}`, "PUT", data)
          .then(async (res: Response) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error);
            }
            setEditSheetOpen(false);
            handleToast(
              "Expense Type Updated",
              "Expense type updated successfully.",
            );
          })
          .catch((error: Error) =>
            handleToast(
              "Expense Type Update Failed",
              error.message,
              "destructive",
            ),
          );
      }

      function deleteExpenseType() {
        apiRequest(`/cxf/type/${row.original.id}`, "DELETE")
          .then(async (res: Response) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error);
            }
            setAlertDialogOpen(false);
            handleToast(
              "Expense Type Deleted",
              "Expense type deleted successfully.",
            );
          })
          .catch((error: Error) =>
            handleToast(
              "Expense Type Delete Failed",
              error.message,
              "destructive",
            ),
          );
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditSheetOpen(true);
                }}
              >
                Edit expense
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAlertDialogOpen(true);
                }}
              >
                Delete expense
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {EditTypeSheet(editSheetOpen, setEditSheetOpen, onSubmit, row)}
          <DeleteDialog
            setAlertDialogOpen={setAlertDialogOpen}
            alertDialogOpen={alertDialogOpen}
            deleteExpense={deleteExpenseType}
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

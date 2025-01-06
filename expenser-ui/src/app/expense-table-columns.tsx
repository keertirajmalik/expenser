import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/app/create-dialog/expense-form";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DeleteDialog } from "@/components/data-table/row-action";
import { badgeVariants } from "@/components/ui/badge";
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
import { Expense } from "@/types/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, parse } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { z } from "zod";

export const columns: ColumnDef<Expense>[] = [
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
    accessorKey: "type",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Type" />;
    },
    cell: ({ row }) => {
      return (
        <Link className={badgeVariants({ variant: "default" })} to="/type">
          {row.getValue("type")}
        </Link>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Amount" />;
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Date" />;
    },
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [editSheetOpen, setEditSheetOpen] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      const queryClient = useQueryClient();

      const editExpenseMutation = useMutation({
        mutationFn: async (data: z.infer<typeof ExpenseFormSchema>) => {
          const expenseData = {
            ...data,
            amount: Number.isFinite(parseFloat(data.amount))
              ? parseFloat(data.amount)
              : (() => {
                  throw new Error("Invalid amount format");
                })(),
            date: format(data.date, "dd/MM/yyyy"),
          };
          const res = await apiRequest(
            `/cxf/transaction/${row.original.id}`,
            "PUT",
            expenseData,
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error);
          }
          setEditSheetOpen(false);
          showToast("Expense Updated", "Expense updated successfully.");
        },
        onSettled: () =>
          queryClient.invalidateQueries({ queryKey: ["expenses"] }),
        onError: (error) => showToast("Expense Update Failed", error.message),
      });

      const deleteExpenseMutation = useMutation({
        mutationFn: async () => {
          const res = await apiRequest(
            `/cxf/transaction/${row.original.id}`,
            "DELETE",
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error);
          }
          showToast("Expense Deleted", "Expense deleted successfully.");
        },
        onSettled: () =>
          queryClient.invalidateQueries({ queryKey: ["expenses"] }),
        onError: (error) => showToast("Expense Deletion Failed", error.message),
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
          {EditExpenseSheet(
            editSheetOpen,
            setEditSheetOpen,
            editExpenseMutation.mutate,
            row,
          )}
          <DeleteDialog
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            onDeleteClick={deleteExpenseMutation.mutate}
          />
        </>
      );
    },
  },
];

function EditExpenseSheet(
  editSheetOpen: boolean,
  setEditSheetOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onSubmit: (data: z.infer<typeof ExpenseFormSchema>) => void,
  row: Row<Expense>,
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

        <ExpenseForm
          onSubmit={onSubmit}
          initialData={{
            name: row.original.name,
            type: row.original.type,
            amount: row.original.amount.toString(),
            date: parse(row.original.date.toString(), "dd/MM/yyyy", new Date()),
            note: row.original.note,
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

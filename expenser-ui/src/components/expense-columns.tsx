import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/components/create-dialog/expense-form";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DeleteDialog } from "@/components/data-table/row-action";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ColumnDef, Row } from "@tanstack/react-table";
import { format, parse } from "date-fns";
import { MoreHorizontal } from "lucide-react";
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
    cell: ({ row }) => {
      const [editSheetOpen, setEditSheetOpen] = useState(false);
      const [alertDialogOpen, setAlertDialogOpen] = useState(false);

      function onSubmit(data: z.infer<typeof ExpenseFormSchema>): void {
        const expenseData = {
          ...data,
          amount: parseFloat(data.amount),
          date: format(data.date, "dd/MM/yyyy"),
        };

        apiRequest(`/cxf/transaction/${row.original.id}`, "PUT", expenseData)
          .then(async (res: Response) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error);
            }
            setEditSheetOpen(false);
            showToast("Expense Updated", "Expense updated successfully.");
          })
          .catch((error: Error) =>
            showToast("Expense Update Failed", error.message, "destructive"),
          );
      }

      function deleteExpense() {
        apiRequest(`/cxf/transaction/${row.original.id}`, "DELETE")
          .then(async (res: Response) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error);
            }
            setAlertDialogOpen(false);
            showToast("Expense Deleted", "Expense deleted successfully.");
          })
          .catch((error: Error) =>
            showToast("Expense Delete Failed", error.message, "destructive"),
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
          {EditExpenseSheet(editSheetOpen, setEditSheetOpen, onSubmit, row)}
          <DeleteDialog
            setAlertDialogOpen={setAlertDialogOpen}
            alertDialogOpen={alertDialogOpen}
            deleteFunction={deleteExpense}
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

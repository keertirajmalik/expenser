import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/app/create-dialog/expense-form";
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
import {
  useDeleteExpenseQuery,
  useUpdateExpenseQuery,
} from "@/hooks/use-expense-query";
import { Expense } from "@/types/expense";
import { ColumnDef, Row } from "@tanstack/react-table";
import { parse } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
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

      const editExpenseMutation = useUpdateExpenseQuery();
      const onSubmit = (data: z.infer<typeof ExpenseFormSchema>) => {
        editExpenseMutation.mutate(
          { expense: data, id: row.original.id },
          {
            onSuccess: () => {
              setEditSheetOpen(false);
            },
          },
        );
      };

      const deleteExpenseMutation = useDeleteExpenseQuery();
      const onDeleteClick = () => {
        deleteExpenseMutation.mutate(row.original.id);
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View expense history</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {EditExpenseSheet(editSheetOpen, setEditSheetOpen, onSubmit, row)}
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
          <SheetTitle>Edit Expense Details</SheetTitle>
          <SheetDescription>
            Make changes to your expense here. Click submit when you're done.
          </SheetDescription>
        </SheetHeader>

        <ExpenseForm
          initialData={{
            name: row.original.name,
            type: row.original.type,
            amount: row.original.amount.toString(),
            date: parse(row.original.date.toString(), "dd/MM/yyyy", new Date()),
            note: row.original.note,
          }}
          onSubmit={onSubmit}
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

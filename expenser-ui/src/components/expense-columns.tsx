import {
  ExpenseForm,
  ExpenseFormSchema,
} from "@/components/create-dialog/expense-form";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { Expense } from "@/types/expense";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
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
      const toast = useToast();

      function onSubmit(data: z.infer<typeof ExpenseFormSchema>) {
        const handleError = (error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          toast.toast({
            title: "Expense update Failed",
            description: message,
            variant: "destructive",
          });
        };

        const expenseData = {
          ...data,
          amount: parseFloat(data.amount),
          date: format(data.date, "dd/MM/yyyy"),
        };

        apiRequest(`/cxf/transaction/${row.original.id}`, "PUT", expenseData)
          .then((res: Response) => {
            if (!res.ok) {
              throw new Error(`Failed to update expense: ${res.statusText}`);
            }
            setEditSheetOpen(false);
            toast.toast({
              description: "Expense updated successfully.",
            });
          })
          .catch(handleError);
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
              <DropdownMenuItem>Delete expense</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Expese Details</SheetTitle>
                <SheetDescription>
                  Make changes to your expense here. Click submit when you're
                  done.
                </SheetDescription>
              </SheetHeader>

              <ExpenseForm
                onSubmit={onSubmit}
                initialData={{
                  name: row.original.name,
                  type: row.original.type,
                  amount: row.original.amount.toString(),
                  date: new Date(row.original.date),
                  note: row.original.note,
                }}
              />
            </SheetContent>
          </Sheet>
        </>
      );
    },
  },
];

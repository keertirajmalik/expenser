import { EditInvestmentSheet } from "@/app/investment/editsheet";
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
  useDeleteInvestmentMutation,
  useUpdateInvestmentMutation,
} from "@/hooks/use-investment-query";
import { Investment } from "@/types/investment";
import { TransactionFormSchema } from "@/types/form-schema/transaction";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { z } from "zod";

export const columns: ColumnDef<Investment>[] = [
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
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell: ({ row }) => {
      return (
        <Link className={badgeVariants({ variant: "default" })} to="/category">
          {row.getValue("category")}
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
      const formatted = new Intl.NumberFormat("en-IN", {
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

      const editInvestmentMutation = useUpdateInvestmentMutation();
      const onSubmit = (data: z.infer<typeof TransactionFormSchema>) => {
        editInvestmentMutation.mutate(
          { investment: data, id: row.original.id },
          {
            onSuccess: () => setEditSheetOpen(false),
          },
        );
      };

      const deleteInvestmentMutation = useDeleteInvestmentMutation();
      const onDeleteClick = () =>
        deleteInvestmentMutation.mutate(row.original.id);

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
                <DropdownMenuItem>View Investment history</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <EditInvestmentSheet
            editSheetOpen={editSheetOpen}
            setEditSheetOpen={setEditSheetOpen}
            onSubmit={onSubmit}
            row={row}
          />
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

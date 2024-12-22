import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
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

      function onSubmit(data: z.infer<typeof TypeFormSchema>) {
        const handleError = (error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          toast.toast({
            title: "Expense type creation Failed",
            description: message,
            variant: "destructive",
          });
        };

        const typeData = {
          ...data,
        };

        apiRequest(`/cxf/type/${row.original.id}`, "PUT", typeData)
          .then((res: Response) => {
            if (!res.ok) {
              throw new Error(
                `Failed to update expense type: ${res.statusText}`,
              );
            }
            setEditSheetOpen(false);
            toast.toast({
              description: "Expense type update successfully.",
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

              <TypeForm
                onSubmit={onSubmit}
                initialData={{
                  name: row.original.name,
                  description: row.original.description,
                }}
              />
            </SheetContent>
          </Sheet>
        </>
      );
    },
  },
];

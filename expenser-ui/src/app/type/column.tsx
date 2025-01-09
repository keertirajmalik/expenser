import { TypeFormSchema } from "@/app/create-dialog/type-form";
import { EditTypeSheet } from "@/app/type/editsheet";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DeleteDialog } from "@/components/data-table/row-action";
import {
  useDeleteTypeMutation,
  useUpdateTypeMutation,
} from "@/hooks/use-type-query";
import { Type } from "@/types/expenseType";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const columns: ColumnDef<Type>[] = [
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

      const editTypeMutation = useUpdateTypeMutation();
      const onSubmit = (data: z.infer<typeof TypeFormSchema>) => {
        editTypeMutation.mutate({ type: data, id: row.original.id });
        setEditSheetOpen(false);
      };

      const deleteTypeMutation = useDeleteTypeMutation();
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
          <EditTypeSheet
            row={row}
            editSheetOpen={editSheetOpen}
            setEditSheetOpen={setEditSheetOpen}
            onSubmit={onSubmit}
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

import { EditCategorySheet } from "@/app/category/editsheet";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DeleteDialog } from "@/components/data-table/row-action";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/hooks/use-category-query";
import { Category } from "@/types/category";
import { CategoryFormSchema } from "@/types/form-schema/category";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [editSheetOpen, setEditSheetOpen] = useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      const editCategoryMutation = useUpdateCategoryMutation();
      const onSubmit = (data: z.infer<typeof CategoryFormSchema>) => {
        editCategoryMutation.mutate({ category: data, id: row.original.id });
        setEditSheetOpen(false);
      };

      const deleteCategoryMutation = useDeleteCategoryMutation();
      const onDeleteClick = () => {
        deleteCategoryMutation.mutate(row.original.id);
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
          <EditCategorySheet
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

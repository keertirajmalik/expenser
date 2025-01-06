import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteClick: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  deleteDialogOpen: deleteDialogOpen,
  setDeleteDialogOpen: setAlertDialogOpen,
  onDeleteClick: onDeleteClick,
}) => {
  return (
    <AlertDialog open={deleteDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onDeleteClick()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

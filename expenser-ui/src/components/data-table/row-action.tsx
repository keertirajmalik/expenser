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
  alertDialogOpen: boolean;
  setAlertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteExpense: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  alertDialogOpen,
  setAlertDialogOpen,
  deleteExpense,
}) => {
  return (
    <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
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
          <AlertDialogAction onClick={() => deleteExpense()}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

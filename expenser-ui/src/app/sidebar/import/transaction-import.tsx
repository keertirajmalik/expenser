import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { showToast } from "@/lib/showToast";
import { useState } from "react";

interface TransactionImportPageProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onImported: (transactions: any[]) => void;
}

export default function TransactionImportPage({
  open,
  setOpen,
  onImported,
}: TransactionImportPageProps) {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (droppedFiles: File[]) => {
    // Only accept .xlsx files (keep filename fallback for browsers that don't set MIME).
    const validFiles = droppedFiles.filter(
      (file) =>
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.toLowerCase().endsWith(".xlsx"),
    );

    if (validFiles.length !== droppedFiles.length) {
      showToast(
        "Transactions Import Failed",
        "Only .xlsx Excel files are allowed.",
        "destructive",
      );
    }
    setFiles(validFiles.slice(0, 1)); // Only keep one file
  };

  const onClick = async () => {
    if (!files || files.length === 0) {
      showToast(
        "Transactions Import Failed",
        "Please select an Excel (.xlsx) file to import.",
        "destructive",
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await fetch("/cxf/bulk-import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to import transactions.");
      }
      const transactions = await response.json();

      setOpen(false);
      setFiles(undefined);

      onImported(transactions);
    } catch (error: any) {
      showToast(
        "Transactions Import Failed",
        error?.message ?? String(error),
        "destructive",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>
            Upload your Excel file with transactions here. Click Import when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <Dropzone
          accept={{
            // Use correct MIME type key with the .xlsx extension allowed
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
              [".xlsx"],
            // Optionally allow older .xls if desired:
            // "application/vnd.ms-excel": [".xls"],
          }}
          maxFiles={1}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={handleDrop}
          onError={(err) => {
            console.error(err);
            showToast(
              "Transactions Import Failed",
              err?.message ?? String(err),
              "destructive",
            );
          }}
          src={files}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        <DialogFooter>
          <Button onClick={onClick}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

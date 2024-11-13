import { useState, useEffect } from "react";
import {
  GridRowsProp,
  GridRowId,
  GridRowModel,
  GridColDef,
} from "@mui/x-data-grid";
import { useTransactions } from "../providers/TransactionsContext";
import DataGridTable from "./DataGridTable";

export async function deleteTransaction(id: GridRowId) {
  const response = await fetch(`/cxf/transaction/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
  return;
}

export async function updateTransaction(updatedRow: GridRowModel) {
  const response = await fetch(`/cxf/transaction/${updatedRow.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRow),
  });
  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }
  return;
}

export default function TransactionTable() {
  const { transactions, fetchTransactions } = useTransactions();
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    setRows(transactions);
  }, [transactions]);

  const handleDeleteClick = (id: GridRowId) => {
    deleteTransaction(id).then(fetchTransactions);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    updateTransaction(newRow).then(fetchTransactions);
    return newRow;
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      headerClassName: "home-table-header",
      width: 250,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      headerClassName: "home-table-header",
      width: 250,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      headerClassName: "home-table-header",
      width: 200,
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      headerClassName: "home-table-header",
      width: 200,
      align: "center",
      headerAlign: "center",
      editable: true,
      type: "date",
    },
    {
      field: "note",
      headerName: "Note",
      flex: 1,
      sortable: false,
      headerClassName: "home-table-header",
      editable: true,
    },
  ];

  return (
    <DataGridTable
      rows={rows}
      columns={columns}
      processRowUpdate={processRowUpdate}
      handleDeleteClick={handleDeleteClick}
    />
  );
}

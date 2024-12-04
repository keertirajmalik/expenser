import { useState, useEffect } from "react";
import {
  GridRowsProp,
  GridRowId,
  GridRowModel,
  GridColDef,
} from "@mui/x-data-grid";
import DataGridTable from "./DataGridTable";
import { apiRequest } from "@/util/apiRequest";
import { TransactionType } from "@/types/transactionType";
import useSWR from "swr";

const deleteTransactionType = async (id: GridRowId): Promise<Response> => {
  return apiRequest(`/cxf/type/${id}`, "DELETE");
};

const updateTransactionType = (updatedRow: GridRowModel): Promise<Response> => {
  const transactionData = {
    ...updatedRow,
  };
  return apiRequest(`/cxf/type/${updatedRow.id}`, "PUT", transactionData);
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
    field: "description",
    headerName: "Description",
    headerClassName: "home-table-header",
    width: 250,
    flex: 1,
    editable: true,
  },
];

const fetchTransactionTypes = async (url: string) => {
  const res = await apiRequest(url, "GET");
  if (!res.ok) {
    throw new Error("Failed to fetch types: " + res.statusText);
  }

  const data = await res.json();

  if (!Array.isArray(data.transaction_types)) {
    throw new Error("Fetched types data is not an array");
  }
  return data.transaction_types;
};

export default function TransactionTypeTable(): JSX.Element {
  const { data } = useSWR<TransactionType[]>(
    "/cxf/type",
    fetchTransactionTypes,
  );
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    if (data) {
      setRows(data);
    }
  }, [data]);

  const handleDeleteClick = async (id: GridRowId) => {
    await deleteTransactionType(id);
    const updatedData = await fetchTransactionTypes("/cxf/type");
    setRows(updatedData.transaction_types);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );
    await updateTransactionType(newRow);
    return newRow;
  };

  return (
    <DataGridTable
      rows={rows}
      columns={columns}
      processRowUpdate={processRowUpdate}
      handleDeleteClick={handleDeleteClick}
    />
  );
}

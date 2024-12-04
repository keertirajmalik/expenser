import { useState, useEffect } from "react";
import {
  GridRowsProp,
  GridRowId,
  GridRowModel,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import DataGridTable from "./DataGridTable";
import { Select, MenuItem, SelectChangeEvent, Alert } from "@mui/material";
import { useTransactions } from "@/providers/TransactionsContext";
import { TransactionType } from "@/types/transactionType";
import { apiRequest } from "@/util/apiRequest";
import { formatDate } from "@/util/dateUtil";
import useSWR from "swr";

const deleteTransaction = async (id: GridRowId): Promise<Response> => {
  return await apiRequest(`/cxf/transaction/${id}`, "DELETE");
};

const updateTransaction = async (
  updatedRow: GridRowModel,
): Promise<Response> => {
  const transactionData = {
    ...updatedRow,
    date: formatDate(updatedRow.date),
  };
  return await apiRequest(
    `/cxf/transaction/${updatedRow.id}`,
    "PUT",
    transactionData,
  );
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
    headerAlign: "center",
    align: "center",
    width: 100,
    editable: true,
    renderEditCell: (params) => <TypeSelectCell {...params} />,
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    headerClassName: "home-table-header",
    width: 150,
    editable: true,
  },
  {
    field: "date",
    headerName: "Date",
    headerClassName: "home-table-header",
    width: 100,
    align: "center",
    headerAlign: "center",
    editable: true,
    type: "date",
  },
  {
    field: "note",
    headerName: "Note",
    headerAlign: "center",
    flex: 1,
    sortable: false,
    headerClassName: "home-table-header",
    editable: true,
  },
];

const fetcher = async (url: string): Promise<TransactionType[]> => {
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

const TypeSelectCell = (params: GridCellParams) => {
  const { data: types, error } = useSWR<TransactionType[]>(
    "/cxf/type",
    fetcher,
  );
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    if (types) {
      const validValue = types.find(
        (type: TransactionType) => type.name === params.value,
      );
      setSelectedValue(validValue ? (params.value as string) : "");
    }
  }, [types, params.value]);

  if (error) {
    console.error("Error fetching types:", error);
    return <Alert severity="error">Failed to load transaction types</Alert>;
  }

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string;
    setSelectedValue(newValue);
    params.api.setEditCellValue({
      id: params.id,
      field: params.field,
      value: newValue,
    });
  };

  return (
    <Select value={selectedValue} onChange={handleChange} fullWidth>
      {types?.map((type) => (
        <MenuItem key={type.id} value={type.name}>
          {type.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default function TransactionTable(): JSX.Element {
  const { transactions, fetchTransactions } = useTransactions();
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    setRows(transactions);
  }, [transactions]);

  const handleDeleteClick = async (id: GridRowId) => {
    await deleteTransaction(id);
    fetchTransactions();
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );
    await updateTransaction(newRow);
    fetchTransactions();
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

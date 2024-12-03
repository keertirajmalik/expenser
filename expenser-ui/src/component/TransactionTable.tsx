import { useState, useEffect } from "react";
import {
  GridRowsProp,
  GridRowId,
  GridRowModel,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import { useTransactions } from "../providers/TransactionsContext";
import DataGridTable from "./DataGridTable";
import { Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { TransactionType } from "../types/transactionType";
import { formatDate } from "../util/dateUtil";
import { apiRequest } from "../util/apiRequest";

const deleteTransaction = (id: GridRowId): Promise<void> => {
  return apiRequest(`/cxf/transaction/${id}`, "DELETE");
};

const updateTransaction = (updatedRow: GridRowModel): Promise<void> => {
  const transactionData = {
    ...updatedRow,
    date: formatDate(updatedRow.date),
  };
  return apiRequest(
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

const TypeSelectCell = (params: GridCellParams) => {
  const [types, setTypes] = useState<TransactionType[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    fetch("/cxf/type", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch typess: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.transaction_types)) {
          setTypes(data.transaction_types);
          const validValue = data.transaction_types.find(
            (type: TransactionType) => type.name === params.value,
          );
          setSelectedValue(validValue ? (params.value as string) : "");
        } else {
          console.error("Fetched types data is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching types:", error));
  }, [params.value]);

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
      {types.map((type) => (
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

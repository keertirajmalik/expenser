import { useState, useEffect } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTransactions } from "../providers/TransactionsContext";
import { PaginationModel } from "../types/pagination";

const dataGridStyles = {
  "& .home-table-header": {
    backgroundColor: "#1c2543",
    color: "white",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-iconButtonContainer": {
    color: "white", // Change the color of the sort and filter icons
  },
  "& .MuiDataGrid-sortIcon": {
    color: "white", // Change the color of the sort icon
  },
  "& .MuiDataGrid-menuIconButton": {
    color: "white", // Change the color of the menu icon
  },
};

const paginationModel = { page: 0, pageSize: 10 };
const rowHeight = 52; // Default row height in DataGrid
const headerHeight = 56; // Default header height in DataGrid
const footerHeight = 56; // Default footer height in DataGrid
const calculateHeight = (pageSize: number) => {
  return headerHeight + footerHeight + rowHeight * pageSize;
};

async function deleteTransaction(id: GridRowId) {
  const response = await fetch(`/cxf/transaction/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }
  return;
}

async function updateTransaction(updatedRow: GridRowModel) {
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
  const [pageSize, setPageSize] = useState(paginationModel.pageSize);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    setRows(transactions);
  }, [transactions]);

  const updateRowMode = (
    id: GridRowId,
    mode: GridRowModes,
    ignoreModifications = false,
  ) => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode, ignoreModifications },
    }));
  };

  const handleEditClick = (id: GridRowId) => () =>
    updateRowMode(id, GridRowModes.Edit);

  const handleSaveClick = (id: GridRowId) => () =>
    updateRowMode(id, GridRowModes.View);

  const handleCancelClick = (id: GridRowId) => () => {
    updateRowMode(id, GridRowModes.View, true);
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteTransaction(id).then(fetchTransactions);
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    updateTransaction(newRow).then(fetchTransactions);
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === "rowFocusOut") {
      event.defaultMuiPrevented = true;
    }
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
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      headerClassName: "home-table-header",
      width: 100,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save-${params.id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(params.id)}
            />,
            <GridActionsCellItem
              key={`cancel-${params.id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(params.id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key={`edit-${params.id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete-${params.id}`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params.id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPageSize(
      Math.min(
        newPaginationModel.pageSize,
        transactions.length -
          newPaginationModel.page * newPaginationModel.pageSize,
      ),
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        paddingTop: 2,
      }}
    >
      <Paper
        elevation={3}
        style={{
          height: calculateHeight(pageSize),
          width: "90%",
          overflow: "scroll",
        }}
      >
        <Box sx={dataGridStyles}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            disableRowSelectionOnClick
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            initialState={{
              pagination: { paginationModel },
              sorting: { sortModel: [{ field: "date", sort: "desc" }] },
            }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[10, 20, 50]}
            sx={{ border: 0 }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

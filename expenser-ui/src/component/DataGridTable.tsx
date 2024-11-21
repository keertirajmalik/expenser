import React, { useMemo, useState } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridRowModesModel,
  GridColDef,
  GridRowModel,
  GridEventListener,
  GridActionsCellItem,
  GridRowModes,
  GridRowId,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface TransactionDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  processRowUpdate: (newRow: GridRowModel) => GridRowModel;
  handleDeleteClick: (id: GridRowModel["id"]) => void;
}

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

const paginationModel: GridPaginationModel = { page: 0, pageSize: 10 };
const rowHeight = 52; // Default row height in DataGrid
const headerHeight = 56; // Default header height in DataGrid
const footerHeight = 56; // Default footer height in DataGrid
const calculateHeight = (pageSize: number) => {
  return headerHeight + footerHeight + rowHeight * pageSize;
};

const DataGridTable: React.FC<TransactionDataGridProps> = ({
  rows,
  columns,
  processRowUpdate,
  handleDeleteClick,
}) => {
  const [pageSize, setPageSize] = useState(paginationModel.pageSize);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

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

  const handleEditClick = (id: GridRowId) => {
    updateRowMode(id, GridRowModes.Edit);
  };

  const handleSaveClick = (id: GridRowId) => {
    updateRowMode(id, GridRowModes.View);
  };

  const handleCancelClick = (id: GridRowId) => {
    updateRowMode(id, GridRowModes.View, true);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handlePaginationModelChange = (
    newPaginationModel: GridPaginationModel,
  ) => {
    setPageSize(
      Math.min(
        newPaginationModel.pageSize,
        rows.length - newPaginationModel.page * newPaginationModel.pageSize,
      ),
    );
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === "rowFocusOut") {
      event.defaultMuiPrevented = true;
    }
  };

  const action: GridColDef = {
    field: "actions",
    type: "actions",
    headerName: "Actions",
    headerClassName: "home-table-header",
    width: 100,
    renderCell: (params) => {
      const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key={`save-${params.id}`}
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: "primary.main",
            }}
            onClick={() => handleSaveClick(params.id)}
          />,
          <GridActionsCellItem
            key={`cancel-${params.id}`}
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={() => handleCancelClick(params.id)}
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
          onClick={() => handleEditClick(params.id)}
          color="inherit"
        />,
        <GridActionsCellItem
          key={`delete-${params.id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.id)}
          color="inherit"
        />,
      ];
    },
  };

  // Add the action column to the columns array
  const memoizedColumns = useMemo(() => {
    return [...columns, action];
  }, [columns, action]);

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
            columns={memoizedColumns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            disableRowSelectionOnClick
            slotProps={{
              toolbar: {},
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
};

export default DataGridTable;

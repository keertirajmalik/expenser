import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { useTransactions } from "../providers/TransactionsContext";
import { PaginationModel } from "../types/pagination";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    headerClassName: "home-table-header",
    width: 250,
  },
  {
    field: "type",
    headerName: "Type",
    headerClassName: "home-table-header",
    width: 250,
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    headerClassName: "home-table-header",
    width: 200,
  },
  {
    field: "date",
    headerName: "Date",
    headerClassName: "home-table-header",
    width: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "note",
    headerName: "Note",
    flex: 1,
    sortable: false,
    headerClassName: "home-table-header",
  },
];

const paginationModel = { page: 0, pageSize: 10 };
const rowHeight = 52; // Default row height in DataGrid
const headerHeight = 56; // Default header height in DataGrid
const footerHeight = 56; // Default footer height in DataGrid
const calculateHeight = (pageSize: number) => {
  return headerHeight + footerHeight + rowHeight * pageSize;
};

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

export default function TransactionTable() {
  const { transactions } = useTransactions();
  const [pageSize, setPageSize] = useState(paginationModel.pageSize);

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
            rows={transactions}
            columns={columns}
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

//TODO: Add edit and delete buttons to the table: https://mui.com/x/react-data-grid/editing/

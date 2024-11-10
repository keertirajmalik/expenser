import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import { PaginationModel } from "./types/pagination";
import { Transaction } from "./types/transactions";

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

export default function TransactionTable() {
  const [pageSize, setPageSize] = useState(paginationModel.pageSize);
  const [rows, setRows] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("cxf/transaction");
        const data = await response.json();
        if (Array.isArray(data.transaction)) {
          const formattedData = data.transaction.map((item: Transaction) => ({
            id: item.ID,
            name: item.Name,
            type: item.TransactionType,
            amount: item.Amount,
            date: item.Date,
            note: item.Note,
          }));
          setRows(formattedData);
        } else {
          console.error("Expected an array but got:", data.transaction);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePaginationModelChange = (newPaginationModel: PaginationModel) => {
    setPageSize(
      Math.min(
        newPaginationModel.pageSize,
        rows.length - newPaginationModel.page * newPaginationModel.pageSize,
      ),
    );
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
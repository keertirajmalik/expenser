import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

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

const rows = [
  {
    id: 1,
    name: "John Doe",
    type: "Expense",
    amount: 10054445656456456,
    date: "01/01/2021",
    note: "Dinner at a fancy restaurant with friends",
  },
  {
    id: 2,
    name: "Jane Smith",
    type: "Expense",
    amount: 200,
    date: "02/01/2021",
    note: "Groceries for the week including fruits, vegetables, and snacks",
  },
  {
    id: 3,
    name: "Alice Johnson",
    type: "Expense",
    amount: 150,
    date: "03/01/2021",
    note: "Utilities bill for electricity and water",
  },
  {
    id: 4,
    name: "Bob Brown",
    type: "Expense",
    amount: 250,
    date: "04/01/2021",
    note: "Monthly rent payment for the apartment",
  },
  {
    id: 5,
    name: "Charlie Davis",
    type: "Expense",
    amount: 300,
    date: "05/01/2021",
    note: "Car payment for the new sedan",
  },
  {
    id: 6,
    name: "Diana Evans",
    type: "Expense",
    amount: 120,
    date: "06/01/2021",
    note: "Insurance premium for health and car",
  },
  {
    id: 7,
    name: "Ethan Foster",
    type: "Expense",
    amount: 180,
    date: "07/01/2021",
    note: "Entertainment expenses including movies and games",
  },
  {
    id: 8,
    name: "Fiona Green",
    type: "Expense",
    amount: 220,
    date: "08/01/2021",
    note: "Travel expenses for the weekend trip to the mountains",
  },
  {
    id: 9,
    name: "George Harris",
    type: "Expense",
    amount: 90,
    date: "09/01/2021",
    note: "Dining out at various restaurants and cafes",
  },
  {
    id: 10,
    name: "Hannah White",
    type: "Expense",
    amount: 160,
    date: "10/01/2021",
    note: "Shopping for clothes and accessories",
  },
  {
    id: 11,
    name: "Ian King",
    type: "Expense",
    amount: 130,
    date: "11/01/2021",
    note: "Medical expenses for doctor's visit and medications",
  },
  {
    id: 12,
    name: "Jack Lee",
    type: "Expense",
    amount: 110,
    date: "12/01/2021",
    note: "Subscriptions for online streaming services and magazines",
  },
  {
    id: 13,
    name: "Karen Martinez",
    type: "Expense",
    amount: 140,
    date: "13/01/2021",
    note: "Gym membership fee for the month",
  },
  {
    id: 14,
    name: "Larry Nelson",
    type: "Expense",
    amount: 170,
    date: "14/01/2021",
    note: "Fuel expenses for the car",
  },
  {
    id: 15,
    name: "Megan Owens",
    type: "Expense",
    amount: 190,
    date: "15/01/2021",
    note: "Maintenance costs for home repairs and improvements",
  },
  {
    id: 16,
    name: "Nathan Parker",
    type: "Expense",
    amount: 210,
    date: "16/01/2021",
    note: "Education expenses including books and tuition fees",
  },
  {
    id: 17,
    name: "Olivia Quinn",
    type: "Expense",
    amount: 230,
    date: "17/01/2021",
    note: "Gifts for family and friends for various occasions",
  },
  {
    id: 18,
    name: "Paul Roberts",
    type: "Expense",
    amount: 240,
    date: "18/01/2021",
    note: "Charity donations to local organizations",
  },
  {
    id: 19,
    name: "Quincy Scott",
    type: "Expense",
    amount: 260,
    date: "19/01/2021",
    note: "Savings deposited into the bank account",
  },
  {
    id: 20,
    name: "Rachel Turner",
    type: "Expense",
    amount: 280,
    date: "20/01/2021",
    note: "Investments in stocks and mutual funds",
  },
  {
    id: 21,
    name: "Steve Underwood",
    type: "Expense",
    amount: 300,
    date: "21/01/2021",
    note: "Miscellaneous expenses for various small items",
  },
  {
    id: 22,
    name: "Tina Vincent",
    type: "Expense",
    amount: 320,
    date: "22/01/2021",
    note: "Vacation expenses for the trip to the beach",
  },
  {
    id: 23,
    name: "Uma Walker",
    type: "Expense",
    amount: 340,
    date: "23/01/2021",
    note: "Home improvement projects including painting and new furniture",
  },
  {
    id: 24,
    name: "Victor Xander",
    type: "Expense",
    amount: 360,
    date: "24/01/2021",
    note: "Electronics purchase including a new laptop and accessories",
  },
  {
    id: 25,
    name: "Wendy Young",
    type: "Expense",
    amount: 380,
    date: "25/01/2021",
    note: "Furniture purchase for the living room",
  },
  {
    id: 26,
    name: "Xavier Zane",
    type: "Expense",
    amount: 400,
    date: "26/01/2021",
    note: "Pet care expenses including food and vet visits",
  },
  {
    id: 27,
    name: "Yvonne Adams",
    type: "Expense",
    amount: 420,
    date: "27/01/2021",
    note: "Clothing purchase for the new season",
  },
  {
    id: 28,
    name: "Zachary Brown",
    type: "Expense",
    amount: 440,
    date: "28/01/2021",
    note: "Beauty products and salon visits",
  },
  {
    id: 29,
    name: "Aaron Clark",
    type: "Expense",
    amount: 460,
    date: "29/01/2021",
    note: "Hobbies including sports equipment and supplies",
  },
  {
    id: 30,
    name: "Betty Davis",
    type: "Expense",
    amount: 480,
    date: "30/01/2021",
    note: "Books and educational materials",
  },
];
const paginationModel = { page: 0, pageSize: 10 };

const calculateHeight = (pageSize: number) => {
  const rowHeight = 52; // Default row height in DataGrid
  const headerHeight = 56; // Default header height in DataGrid
  const footerHeight = 56; // Default footer height in DataGrid
  return headerHeight + footerHeight + rowHeight * pageSize;
};

export default function Home() {
  const [pageSize, setPageSize] = useState(paginationModel.pageSize);

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
        <Box
          sx={{
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
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            onPaginationModelChange={(newPaginationModel) => {
              setPageSize(
                Math.min(
                  newPaginationModel.pageSize,
                  rows.length -
                    newPaginationModel.page * newPaginationModel.pageSize,
                ),
              );
            }}
            pageSizeOptions={[10, 20, 50]}
            sx={{ border: 0 }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chance from "chance";
import * as React from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";

interface Data {
  name: string;
  amount: number;
  type: string;
  date: Date;
  note: string;
}

interface ColumnData {
  dataKey: keyof Data;
  label: string;
  numeric?: boolean;
  width?: number;
}

const chance = new Chance(42);

function createData(): Data {
  return {
    name: chance.first(),
    amount: chance.integer({ min: 1, max: 1000 }),
    type: chance.animal(),
    date: chance.date(),
    note: chance.sentence(),
  };
}

const columns: ColumnData[] = [
  { width: 0, label: "Name", dataKey: "name" },
  { width: 0, label: "Amount", dataKey: "amount", numeric: true },
  { width: 0, label: "Type", dataKey: "type" },
  { width: 50, label: "Date", dataKey: "date" },
  { width: 200, label: "Note", dataKey: "note" },
];

const rows: Data[] = Array.from({ length: 12 }, () => createData());

const VirtuosoTableComponents: TableComponents<Data> = {
  // eslint-disable-next-line react/display-name
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  // eslint-disable-next-line react/display-name
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  // eslint-disable-next-line react/display-name
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "#1c2543",
            color: "white",
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Data) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}
          height="75px"
        >
          {column.dataKey === "date"
            ? row[column.dataKey].toLocaleString("en-GB", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function Home() {
  const tableHeight = rows.length * 75 + 75;
  const maxHeight = "90vh";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 2,
      }}
    >
      <Paper
        elevation={3}
        style={{
          height:
            tableHeight > window.innerHeight - 50 ? maxHeight : tableHeight,
          width: "90%",
        }}
      >
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </Box>
  );
}

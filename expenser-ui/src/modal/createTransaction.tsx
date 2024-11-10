import { Box, Button, FormGroup, MenuItem, Paper, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  padding: 3,
};

interface CreateTransactionProps {
  open: boolean;
  handleClose: () => void;
}

const currencies = [{ value: "Travel", label: "Travel" }];

const CreateTransaction = ({ open, handleClose }: CreateTransactionProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.preventDefault();
    const transactionData = {
      name,
      type,
      amount: parseInt(amount), // Ensure amount is an integer
      date: formatDate(date),
      note,
    };

    fetch("/cxf/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => response.json())
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        console.error("There was an error creating the transaction!", error);
      });
  }

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Transaction
          </Typography>
          <FormGroup>
            <TextField
              required
              label="Name"
              size="small"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
          />
          <Box style={{ display: "flex", alignItems: "center", gap:"16px"}}>
            <TextField
              required
              select
              label="Type"
              size="small"
              margin="normal"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ flex: 1 }}
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              href="/transactionType"
              sx={{ padding:"8px 16px" }}
            >
              Create Transaction Type
            </Button>
          </Box>
            <TextField
              required
              label="Amount"
              size="small"
              margin="normal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              required
              label="Date"
              type="date"
              size="small"
              margin="normal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Note"
              multiline
              rows={4}
              size="small"
              margin="normal"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </FormGroup>
        </Paper>
      </Modal>
  );
};

export default CreateTransaction;

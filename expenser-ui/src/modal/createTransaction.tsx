import React, { useState, useEffect } from "react";
import { Box, Button, FormGroup, Paper, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { TransactionType } from "../types/transactions type";
import CreateTransactionType from "./createTransactionType";

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

const CreateTransaction = ({ open, handleClose }: CreateTransactionProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    date: "",
    note: "",
  });
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    [],
  );
  const [nestedModalOpen, setNestedModalOpen] = useState(false);

  useEffect(() => {
    if (open && !nestedModalOpen) {
      const fetchTransactionTypes = async () => {
        try {
          const response = await fetch("/cxf/type");
          const data = await response.json();
          setTransactionTypes(data.transaction_types ?? []);
        } catch (error) {
          console.error("Error fetching transaction types:", error);
        }
      };

      fetchTransactionTypes();
    }
  }, [open, nestedModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    const transactionData = {
      ...formData,
      amount: parseInt(formData.amount),
      date: formatDate(formData.date),
    };

    fetch("/cxf/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });
    handleClose();
  };

  const handleNestedModalOpen = () => {
    setNestedModalOpen(true);
  };

  const handleNestedModalClose = () => {
    setNestedModalOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Paper sx={style}>
          <Typography variant="h6">Create Transaction</Typography>
          <FormGroup>
            <TextField
              required
              label="Name"
              size="small"
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Box display="flex" alignItems="center" gap="16px">
              <TextField
                required
                select
                label="Type"
                size="small"
                margin="normal"
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ flex: 1 }}
              >
                {transactionTypes.length > 0 ? (
                  transactionTypes.map((option) => (
                    <MenuItem key={option.Name} value={option.Name}>
                      {option.Name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No options available</MenuItem>
                )}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNestedModalOpen}
                sx={{ padding: "8px 16px" }}
              >
                Create Transaction Type
              </Button>
            </Box>
            <TextField
              required
              label="Amount"
              size="small"
              margin="normal"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <TextField
              required
              label="Date"
              type="date"
              size="small"
              margin="normal"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Note"
              multiline
              rows={4}
              size="small"
              margin="normal"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </FormGroup>
        </Paper>
      </Modal>
      <CreateTransactionType
        open={nestedModalOpen}
        handleClose={handleNestedModalClose}
      />
    </>
  );
};

export default CreateTransaction;
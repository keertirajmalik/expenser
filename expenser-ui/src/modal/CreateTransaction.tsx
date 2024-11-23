import React, { useState, useEffect } from "react";
import { Box, Button, FormGroup, Paper, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { TransactionType } from "../types/transactionType";
import CreateTransactionType from "../modal/CreateTransactionType";
import { useTransactions } from "../providers/TransactionsContext";
import { formatDate } from "../util/dateUtil";

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

const CreateTransaction = ({
  open,
  handleClose,
}: CreateTransactionProps): JSX.Element => {
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    date: getTodayDate(),
    note: "",
  });
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    [],
  );
  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const { fetchTransactions } = useTransactions();
  const [errors, setErrors] = useState<{
    name?: string;
    type?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    if (open && !nestedModalOpen) {
      const fetchTransactionTypes = async () => {
        try {
          const response = await fetch("/cxf/type", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
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

  const validateForm = () => {
    const errors: { name?: string; type?: string; amount?: string } = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.type) errors.type = "Type is required";
    if (!formData.amount) errors.amount = "Amount is required";
    return errors;
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: formatDate(formData.date),
    };

    fetch("/cxf/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(transactionData),
    }).then(() => {
      handleClose();
      fetchTransactions();
    });
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
              error={!!errors.name}
              helperText={errors.name}
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
                error={!!errors.type}
                helperText={errors.type}
              >
                {transactionTypes.length > 0 ? (
                  transactionTypes.map((option) => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.name}
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
              error={!!errors.amount}
              helperText={errors.amount}
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

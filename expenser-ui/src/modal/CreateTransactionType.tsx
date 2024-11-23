import React, { useState, useCallback } from "react";
import {
  Button,
  FormGroup,
  Paper,
  TextField,
  Modal,
  Typography,
} from "@mui/material";

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

const CreateTransactionType = ({
  open,
  handleClose,
}: CreateTransactionProps): JSX.Element => {
  const [formState, setFormState] = useState({
    name: "",
    note: "",
    error: "",
    isLoading: false,
  });

  const { name, note, error, isLoading } = formState;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      event.preventDefault();
      setFormState((prevState) => ({ ...prevState, error: "" }));

      if (!name.trim()) {
        setFormState((prevState) => ({
          ...prevState,
          error: "Name is required",
        }));
        return;
      }
      setFormState((prevState) => ({ ...prevState, isLoading: true }));

      const transactionTypeData = {
        name: formState.name,
        note: formState.note,
      };

      fetch("/cxf/type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(transactionTypeData),
      })
        .then((response) => response.json())
        .then(() => {
          handleClose();
        })
        .catch((error) => {
          setFormState((prevState) => ({ ...prevState, error: error.message }));
        })
        .finally(() => {
          setFormState((prevState) => ({ ...prevState, isLoading: false }));
        });
    },
    [name],
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={style}>
        <Typography variant="h6">Create Transaction Type</Typography>
        <FormGroup>
          <TextField
            label="Name"
            name="name"
            size="small"
            margin="normal"
            value={name}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            disabled={isLoading}
            aria-label="Transaction type name"
          />
          <TextField
            label="Note"
            name="note"
            multiline
            rows={4}
            size="small"
            margin="normal"
            value={note}
            onChange={handleChange}
            disabled={isLoading}
            aria-label="Transaction type note"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </FormGroup>
      </Paper>
    </Modal>
  );
};

export default CreateTransactionType;

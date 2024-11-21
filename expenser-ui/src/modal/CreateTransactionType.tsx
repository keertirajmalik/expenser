import React from "react";
import { Button, FormGroup, Paper, TextField } from "@mui/material";
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

const CreateTransactionType = ({
  open,
  handleClose,
}: CreateTransactionProps) => {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setIsLoading(true);

    const transactionTypeData = {
      name,
      note,
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
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
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
          Create Transaction Type
        </Typography>
        <FormGroup role="form">
          <TextField
            required
            label="Name"
            size="small"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={isLoading}
            aria-label="Transaction type name"
          />
          <TextField
            label="Note"
            multiline
            rows={4}
            size="small"
            margin="normal"
            value={note}
            onChange={(e) => setNote(e.target.value)}
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

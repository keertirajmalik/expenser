import { useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import { Menu, MenuItem } from "@mui/material";
import CreateTransaction from "../CreateTransaction";
import CreateTransactionType from "../CreateTransactionType";

const ExpenseButtonMenu: React.FC = () => {
  const [openTransaction, setTransactionModalOpen] = useState(false);
  const [openTransactionType, setTransactionTypeModalOpen] = useState(false);
  const [anchorExpenseEl, setExpenseAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const handleTransactionTypeOpen = () => setTransactionTypeModalOpen(true);
  const closeTransactionTypeModal = () => setTransactionTypeModalOpen(false);

  const handleTransactionOpen = () => setTransactionModalOpen(true);
  const closeTransactionModal = () => setTransactionModalOpen(false);

  const handleExpenseMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExpenseAnchorEl(event.currentTarget);
  };
  const handleExpenseMenuClose = () => {
    setExpenseAnchorEl(null);
  };

  const handleExpenseMenuItemClick = (type: string) => {
    if (type === "expense") {
      handleTransactionOpen();
    } else if (type === "transactionType") {
      handleTransactionTypeOpen();
    }
    handleExpenseMenuClose();
  };

  return (
    <>
      <Menu
        anchorEl={anchorExpenseEl}
        open={Boolean(anchorExpenseEl)}
        onClose={handleExpenseMenuClose}
      >
        <MenuItem onClick={() => handleExpenseMenuItemClick("expense")}>
          Create Expense
        </MenuItem>
        <MenuItem onClick={() => handleExpenseMenuItemClick("transactionType")}>
          Create Transaction Type
        </MenuItem>
      </Menu>
      <ButtonGroup variant="contained" sx={{ marginRight: 2 }}>
        <Button
          startIcon={<AddIcon fontSize="inherit" />}
          onClick={handleTransactionOpen}
        >
          Create Expense
        </Button>
        <Button onClick={handleExpenseMenuOpen}>▼</Button>
      </ButtonGroup>
      <CreateTransaction
        open={openTransaction}
        handleClose={closeTransactionModal}
      />
      <CreateTransactionType
        open={openTransactionType}
        handleClose={closeTransactionTypeModal}
      />
    </>
  );
};

export default ExpenseButtonMenu;

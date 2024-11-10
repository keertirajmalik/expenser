import React, { createContext, useState, useContext, useEffect } from "react";
import { Transaction } from "../types/transactions";

interface TransactionsContextProps {
  transactions: Transaction[];
  fetchTransactions: () => void;
}

const TransactionsContext = createContext<TransactionsContextProps | undefined>(
  undefined,
);

const fetchTransactions = async (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
) => {
  try {
    const response = await fetch("/cxf/transaction");
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
      setTransactions(formattedData);
    } else {
      console.error("Expected an array but got:", data.transactions);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions(setTransactions);
  }, []);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions: () => fetchTransactions(setTransactions),
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }
  return context;
};

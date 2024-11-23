import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Transaction } from "../types/transaction";

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
    const response = await fetch("/cxf/transaction", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();

    if (Array.isArray(data.transactions)) {
      const formattedData = data.transactions.map((item: Transaction) => {
        const [day, month, year] = item.date.toString().split("/");
        const parsedDate = new Date(`${year}-${month}-${day}`);
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          amount: item.amount,
          date: parsedDate,
          note: item.note,
        };
      });
      setTransactions(formattedData);
    } else {
      console.error("Expected an array but got:", data.transactions);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setTransactions([]);
  }
};

export const TransactionsProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
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

export const useTransactions = (): TransactionsContextProps => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }
  return context;
};

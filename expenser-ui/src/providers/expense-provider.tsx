import { Expense } from "@/types/expense";
import { apiRequest } from "@/lib/apiRequest";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface ExpenseContextProps {
  expenses: Expense[];
  fetchExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(
  undefined,
);

const fetchExpenses = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
) => {
  apiRequest("/cxf/transaction", "GET")
    .then((response) => {
      response.json().then((data) => {
        if (Array.isArray(data.transactions)) {
          const formattedData = data.transactions.map((item: Expense) => {
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
          setExpenses(formattedData);
        } else {
          console.error("Expected an array but got:", data.transactions);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setExpenses([]);
    });
};

export const ExpensesProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    fetchExpenses(setExpenses);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses: expenses,
        fetchExpenses: () => fetchExpenses(setExpenses),
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = (): ExpenseContextProps => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within a ExpensesProvider");
  }
  return context;
};

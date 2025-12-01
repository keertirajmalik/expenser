import { CreateTransactionForm } from "@/app/create-dialog/create-transaction-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { parseDate } from "@/lib/dateUtil";
import { showToast } from "@/lib/showToast";
import { TransactionType } from "@/types/transaction";
import { useEffect, useState } from "react";

interface TransactionPageProps {
  transactionData: {
    name: string;
    type: TransactionType;
    category: string;
    date: string;
    amount: string;
    note: string;
  }[];
  handleCloseReview: () => void;
}

export default function TransactionReviewPage({
  transactionData,
  handleCloseReview,
}: TransactionPageProps) {
  const [items, setItems] = useState(transactionData);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const removeIndex = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (count - 1 === 0) handleCloseReview();
    setCount(count - 1);
    if (count === current) setCurrent(current - 1);
  };

  const handleCompleted = (index: number) => {
    removeIndex(index);
    showToast("Transaction saved ✅", "default");
  };

  const handleCancel = (index: number) => {
    removeIndex(index);
    showToast("Skipped this transaction ❌", "default");
  };

  if (items.length === 0) {
    showToast("No more transactions 🎉", "default");
  }

  return (
    <div className="flex-col items-center justify-center">
      <Carousel setApi={setApi} className="w-full max-w-md relative">
        <CarouselContent>
          {items.map((tx, index) => (
            <CarouselItem key={index} className="w-full basis-full">
              <div className="p-2 w-full">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <CreateTransactionForm
                      creation={tx.type}
                      initialData={{
                        name: tx.name,
                        category: tx.category,
                        amount: tx.amount,
                        date: parseDate(tx.date),
                        note: tx.note,
                      }}
                      onCompleted={() => handleCompleted(index)}
                      onCancel={() => handleCancel(index)}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm">
        Transaction {current} of {count}
      </div>
    </div>
  );
}

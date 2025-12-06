import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategoryQuery } from "@/hooks/use-category-query";
import { useCurrencyFormat } from "@/hooks/use-currency-format";
import { cn } from "@/lib/utils";
import { Category, CategoryType } from "@/types/category";
import { TransactionFormSchema, TransactionFormValues } from "@/types/form-schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ExpenseFormProps {
  onSubmit: (data: TransactionFormValues) => void;
  initialData?: TransactionFormValues;
}

export function ExpenseForm({ initialData, onSubmit }: ExpenseFormProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: initialData || {
      name: "",
      category: "",
      amount: "",
      date: undefined,
      note: "",
    },
  });

  const { data: categories, isLoading } = useGetCategoryQuery();
  const handleCurrencyChange = useCurrencyFormat((value: string) =>
    form.setValue("amount", value),
  );

  useEffect(() => {
    if (!isLoading && categories) {
      const filtered = categories.filter(
        (category: Category) => category.type == CategoryType.Expense,
      );
      setFilteredCategories(filtered);

      if (initialData) {
        form.reset(initialData);
        if (initialData.category) {
          const categoryOption = filtered.find(
            (category) => category.name === initialData.category,
          );
          if (categoryOption) {
            form.setValue("category", categoryOption.id);
          }
        }
        if (initialData.amount) {
          const numericValue = parseFloat(initialData.amount);
          if (!Number.isNaN(numericValue) && numericValue > 0) {
            handleCurrencyChange(numericValue.toString());
          }
        }
      }
    }
  }, [isLoading, categories, initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Expense Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of your expense" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel required>Expense Category</FormLabel>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? filteredCategories?.find(
                            (category) => category.id === field.value,
                          )?.name
                        : "Select Expense Category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search expense category..." />
                    <CommandList>
                      <CommandEmpty>No expense category found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCategories?.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue("category", category.id);
                              setOpenCategory(false);
                            }}
                          >
                            {category.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                category.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Expense Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Expense amount"
                  value={field.value}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel required>Expense Date</FormLabel>
              <Popover
                open={openCalendar}
                onOpenChange={setOpenCalendar}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      form.setValue("date", date);
                      setOpenCalendar(false);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    className="w-auto rounded-lg border"
                    captionLayout="dropdown"
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about expense"
                  className="resize-none"
                  maxLength={100}
                  {...field}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground text-right">
                {field.value?.length || 0}/100 characters
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

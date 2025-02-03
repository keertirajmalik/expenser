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
import { cn } from "@/lib/utils";
import { Category, CategoryType } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IncomeFormProps {
  onSubmit: (data: z.infer<typeof IncomeFormSchema>) => void;
  initialData?: {
    name: string;
    category: string;
    amount: string;
    date: Date;
    note: string;
  };
}

export const IncomeFormSchema = z.object({
  name: z.string().nonempty({
    message: "Income name is required.",
  }),
  category: z.string().nonempty({
    message: "Income category is required.",
  }),
  amount: z
    .string()
    .nonempty({ message: "Income amount is required." })
    .transform((val) => val.replace(/[^0-9.]/g, "")) // Remove currency formatting
    .refine((val) => /^(?:\d{1,15}|\d{1,15}\.\d{1,4})$/.test(val), {
      message:
        "Amount must be a positive number with up to 4 decimal places (max 15 digits).",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0.",
    }),
  date: z.date({
    required_error: "Income date is required.",
  }),
  note: z.string(),
});

export function IncomeForm({ initialData, onSubmit }: IncomeFormProps) {
  const [openCategory, setOpenCategory] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const { data: categories, isLoading } = useGetCategoryQuery();

  const form = useForm<z.infer<typeof IncomeFormSchema>>({
    resolver: zodResolver(IncomeFormSchema),
    defaultValues: initialData || {
      name: "",
      category: "",
      amount: "",
      date: undefined,
      note: "",
    },
  });

  useEffect(() => {
    if (!isLoading && categories) {
      const filtered = categories.filter(
        (category: Category) => category.type == CategoryType.Income
      );
      setFilteredCategories(filtered);

      if (initialData) {
        form.reset(initialData);
        if (initialData.category) {
          const categoryOption = filtered.find(
            (category) => category.name === initialData.category
          );
          if (categoryOption) {
            form.setValue("category", categoryOption.id);
          }

          if (initialData.amount) {
            const numericValue = parseFloat(initialData.amount);
            if (!isNaN(numericValue) && numericValue > 0) {
              const formattedValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              }).format(numericValue);
              form.setValue("amount", formattedValue);
            }
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
              <FormLabel required>Income Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of your income" {...field} />
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
              <FormLabel required>Income Category</FormLabel>
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? filteredCategories?.find(
                            (category) => category.id === field.value
                          )?.name
                        : "Select Income Category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder="Search income category..." />
                    <CommandList>
                      <CommandEmpty>No income category found.</CommandEmpty>
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
                                  : "opacity-0"
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
              <FormLabel required>Income Amount</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Income amount"
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if (value) {
                      field.onChange(value);
                    } else {
                      field.onChange("");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if (value) {
                      const numericValue = parseFloat(value);
                      if (!isNaN(numericValue) && numericValue > 0) {
                        const formattedValue = new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "INR",
                        
                        }).format(numericValue);
                        field.onChange(formattedValue);
                      }
                    }
                  }}
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
              <FormLabel required>Income Date</FormLabel>
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
                        !field.value && "text-muted-foreground"
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (!date) return;
                      form.setValue("date", date);
                      setOpenCalendar(false);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
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
                  placeholder="Tell us a little bit about income"
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

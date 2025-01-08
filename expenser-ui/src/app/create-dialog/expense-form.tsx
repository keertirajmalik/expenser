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
import { useGetTypeQuery } from "@/hooks/use-type-query";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ExpenseFormProps {
  onSubmit: (data: z.infer<typeof ExpenseFormSchema>) => void;
  initialData?: {
    name: string;
    type: string;
    amount: string;
    date: Date;
    note: string;
  };
}

export const ExpenseFormSchema = z.object({
  name: z.string().nonempty({
    message: "Expense name is required.",
  }),
  type: z.string().nonempty({
    message: "Expense type is required.",
  }),
  amount: z.string().nonempty({
    message: "Expense amount is required.",
  }),
  date: z.date({
    required_error: "Expense date is required.",
  }),
  note: z.string(),
});

export function ExpenseForm({ initialData, onSubmit }: ExpenseFormProps) {
  const [openType, setOpenType] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const { data: expenseTypes } = useGetTypeQuery();

  const form = useForm<z.infer<typeof ExpenseFormSchema>>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: initialData || {
      name: "",
      type: "",
      amount: "",
      date: undefined,
      note: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      if (initialData.type) {
        const typeOption = expenseTypes?.find(
          (type) => type.name === initialData.type,
        );
        if (typeOption) {
          form.setValue("type", typeOption.id);
        }
      }
    }
  }, [initialData, expenseTypes]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of your expense" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expense Type</FormLabel>
              <Popover open={openType} onOpenChange={setOpenType}>
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
                        ? expenseTypes?.find((type) => type.id === field.value)
                            ?.name
                        : "Select Expense Type"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search expense type..." />
                    <CommandList>
                      <CommandEmpty>No expense type found.</CommandEmpty>
                      <CommandGroup>
                        {expenseTypes?.map((type) => (
                          <CommandItem
                            value={type.name}
                            key={type.id}
                            onSelect={() => {
                              form.setValue("type", type.id);
                              setOpenType(false);
                            }}
                          >
                            {type.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                type.id === field.value
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
              <FormLabel>Expense Amount</FormLabel>
              <FormControl>
                <Input placeholder="Expense amount" {...field} />
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
              <FormLabel>Expense Date</FormLabel>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
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
                <PopoverContent className="w-auto p-0" align="start">
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
                  placeholder="Tell us a little bit about expense"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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

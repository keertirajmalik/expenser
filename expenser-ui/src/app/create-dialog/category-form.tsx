import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().nonempty({
    message: "Expense category name is required.",
  }),
  type: z
    .string({
      error: "Please select a category type",
    })
    .refine((val) => ["Expense", "Investment", "Income"].includes(val), {
      message: "Type must be either 'Expense' or 'Investment' or 'Income'",
    }),
  description: z.string(),
});

interface CategoryFormProps {
  onSubmit: (data: z.infer<typeof CategoryFormSchema>) => void;
  initialData?: {
    name: string;
    type: "Investment" | "Expense" | "Income";
    description: string;
  };
}

export function CategoryForm({ onSubmit, initialData }: CategoryFormProps) {
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: initialData || {
      name: "",
      type: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Name of your category" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Category Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about this category"
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

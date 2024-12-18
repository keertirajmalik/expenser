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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().nonempty({
    message: "Expense  type name is required.",
  }),
  description: z.string(),
});

interface TypeFormProps {
  handleClose: () => void;
}

export function TypeForm({ handleClose }: TypeFormProps) {
  const toast = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const handleError = (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.toast({
        title: "Expense type creation Failed",
        description: message,
        variant: "destructive",
      });
    };

    const typeData = {
      ...data,
    };

    apiRequest("/cxf/type", "POST", typeData)
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(`Failed to save expense: ${res.statusText}`);
        }
        handleClose();
        toast.toast({
          description: "Expense type create successfully.",
        });
      })
      .catch(handleError);
  }

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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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

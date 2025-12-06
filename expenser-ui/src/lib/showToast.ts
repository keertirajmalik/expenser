import { toast } from "@/hooks/use-toast";

export function showToast(
  title: string,
  description: string,
  variant: "default" | "destructive" | null = "default",
) {
  toast({
    title: title,
    description: description,
    variant: variant ?? undefined,
  });
}
//TODO: This is not working
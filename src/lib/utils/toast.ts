import { toast } from "@/components/ui/use-toast";

export const showToast = {
  success: (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  },
  error: (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  },
};

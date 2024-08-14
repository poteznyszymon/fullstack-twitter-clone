import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useFollow = () => {
  const { toast } = useToast();
  const queryClinet = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      try {
        const res = await fetch(`/api/user/follow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return;
      } catch (error) {
        const errorMessage =
          (error as Error).message || "Unknown error occurred";

        console.log(error);
        toast({
          variant: "destructive",
          title: `${errorMessage}`,
        });
        throw error;
      }
    },
    onSuccess: () => {
      Promise.all([
        queryClinet.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClinet.invalidateQueries({ queryKey: ["authUser"] }),
        queryClinet.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${error.message}`,
      });
    },
  });

  return { follow, isPending };
};

export default useFollow;

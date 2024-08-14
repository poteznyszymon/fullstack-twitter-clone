import { Link } from "react-router-dom";
import LogoSvg from "../../../svgs/LogoSvg";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/models/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof loginFormSchema>) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
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
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `${error.message}`,
      });
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    loginMutation(values);
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <LogoSvg className="h-12 md:hidden" />
      <h1 className="md:text-4xl text-2xl tracking-tighter font-bold text-white">
        Login your account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} className="w-80" />
                </FormControl>
                <FormMessage className="text-xs text-red-700" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="password"
                    {...field}
                    className="w-80"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-700" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full flex gap-1">
            <p>Login</p>
            {isPending && <img src="/loading-icon-black.svg" className="w-4" />}
          </Button>
        </form>
      </Form>
      <p className="">
        Don't have an account?{" "}
        <Link to="/auth/register">
          <span className="text-twitter-blue font-bold">Register</span>
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

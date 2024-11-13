import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register: registerUser } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      phoneCountryCode: "+972",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: InsertUser) => {
    setIsLoading(true);
    try {
      const result = await (isLogin 
        ? login({ 
            username: data.username, 
            password: data.password 
          }) 
        : registerUser(data));

      if (!result.ok) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {isLogin
            ? "Welcome back! Please login to continue."
            : "Create a new account to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {!isLogin && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="flex gap-2">
                        <div className="w-[4.5rem]">
                          <PhoneInput
                            country={'il'}
                            enableSearch
                            containerClass="!w-full"
                            inputClass="hidden"
                            buttonClass="!w-full !h-10 !border !border-input !rounded-md"
                            dropdownClass="!w-[250px]"
                            onChange={(_, data: any) => {
                              form.setValue('phoneCountryCode', `+${data.dialCode}`);
                            }}
                            disabled={isLoading}
                          />
                        </div>
                        <FormControl className="flex-1">
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d-]/g, '');
                              field.onChange(value);
                            }}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLogin ? "Login" : "Register"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsLogin(!isLogin)}
                disabled={isLoading}
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

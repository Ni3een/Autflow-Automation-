"use client";

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Form,FormField,FormControl,FormItem,FormMessage, FormLabel} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { error } from "console";

// make schema for login form
const loginFormSchema=z.object({
    email:z.email("Please enter a valid email address"),
    password:z.string().min(1,"Password is required"),
})

type LoginFormValues=z.infer<typeof loginFormSchema>;

export function LoginForm(){
    const router=useRouter();
    const form=useForm<LoginFormValues>({
        resolver:zodResolver(loginFormSchema),
        defaultValues:{
            email:"",
            password:"",
        }
    })

    const onSubmit=async(values:LoginFormValues)=>{
        await authClient.signIn.email({
            email:values.email,
            password:values.password,
            callbackURL:"/",
        },{
            onSuccess:()=>{
            router.push("/");
            },
            onError:(ctx)=>{
                toast.error(ctx.error.message || "Something went wrong");
            }
        })
    }
    const isPending=form.formState.isSubmitting;
    return(
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Login To Continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                        <Image alt="Github" src="/logo/github-sign.svg" height={20} width={20}></Image>
                                        Continue with GitHub
                                    </Button>
                                </div>
                                 <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                        <Image alt="Google" src="/logo/google.svg" height={20} width={20}></Image>
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="m@example.com" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                      </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                      </FormItem>
                                    )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        Login
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Dont have an account?{" "}
                                    <Link href='/signup'  className="underline underline-offset-4">Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
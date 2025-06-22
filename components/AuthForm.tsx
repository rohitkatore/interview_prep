"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormFields from "./FormFields"
import FormField from "./FormFields"
import { useRouter } from "next/navigation"

const authFormSchema = (type:FormType) =>{
    return z.object({
        name : type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email : z.string().email(),
        password :z.string().min(6)
    })
}

function AuthForm({ type }: { type: FormType }) {
    const router = useRouter() ;
    const formSchema = authFormSchema(type) ;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email:"",
            password:""
        },
    })

    const isSignIn = type === "sign-in";
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if(type === "sign-up"){
                console.log("SIGN UP",values) ;
                toast.success("Account created successfully. Please sign in.")
                router.push("/sign-in");
            }else{
                console.log("SIGN IN",values) ;
                toast.success("Sign in successfully.")
                router.push("/")
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error ${error}`) ;
        }
    }

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3 className="text-center">Practise job interviews with AI</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-6 form">
                        {!isSignIn && <FormField name="name" control={form.control} label="Name" placeholder="Your name"/>}
                        <FormField name="email" control={form.control} label="Email" placeholder="Your email" type="email"/>
                        <FormField name="password" control={form.control} label="Password" placeholder="Enter password" type="password"/>
                        <Button className="btn" type="submit">{isSignIn ? "Sign in" : "Create an Account"}</Button>
                    </form>
                </Form>
                <p className="text-center">{isSignIn ? "No account yet ?" : "Have an account already ?"}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
                    {isSignIn ? "Sign Up" : "Sign In"}
                </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm

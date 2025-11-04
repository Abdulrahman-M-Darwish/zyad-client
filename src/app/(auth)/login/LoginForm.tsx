"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Button,
	ErrorMessage,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components";
import { useAppDispatch } from "@/store/redux";
import { setUser } from "@/store/features/userSlice";
import Link from "next/link";

const loginSchema = z.object({
	email: z.string().min(1, " "),
	password: z.string().min(1, " "),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
	const form = useForm<LoginFormInputs>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const next = searchParams?.get("next");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const onSubmit = async (data: LoginFormInputs) => {
		setIsLoading(true);
		setError(null);
		const req = await fetch("/api/proxy/auth/login", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: data.email, password: data.password }),
		});
		const res = await req.json();
		if (res?.error) {
			setIsLoading(false);
			setError(res);
			return;
		}

		dispatch(setUser(res));
		setIsLoading(false);
		setError(null);
		router.replace(next || (res.role === "admin" ? "/admin/users" : "/"));
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{error && <ErrorMessage message={error?.message} />}
				<FormField
					control={form.control}
					name="email"
					disabled={isLoading}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="Email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					disabled={isLoading}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<Link
						href="/forgot-password"
						className="text-blue-400 hover:underline"
					>
						Forgot Password?
					</Link>
				</div>
				<Button disabled={isLoading} type="submit" className="w-full">
					Log In
				</Button>
			</form>
		</Form>
	);
};

export default LoginForm;

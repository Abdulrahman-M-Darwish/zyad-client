"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCookiesNext } from "cookies-next";
import { useSignupMutation } from "@/store/api/auth";
import {
	Button,
	ErrorMessage,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Form,
} from "@/components";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const signupSchema = z
	.object({
		email: z.email("Invalid email address"),
		name: z.string().min(3, "Invalid username"),
		age: z.string().refine((val) => !isNaN(+val) && +val > 12),
		phonenumber: z.string().length(11, "phone number must be 11 characters"),
		gender: z.enum(["male", "female"], { error: "Please Select Gender" }),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^a-zA-Z0-9]/,
				"Password must contain at least one special character"
			),
		confirmPassword: z
			.string()
			.min(8, "Confirm password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignupFormInputs = z.infer<typeof signupSchema>;

const SignupForm: React.FC = () => {
	const { setCookie } = useCookiesNext();
	const form = useForm<SignupFormInputs>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			gender: undefined,
			age: "",
			email: "",
			phonenumber: "",
			password: "",
			confirmPassword: "",
		},
	});
	const router = useRouter();
	const [signup, { isLoading, isSuccess, error }] = useSignupMutation();
	const onSubmit = async ({
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		confirmPassword,
		age,
		...data
	}: SignupFormInputs) => {
		try {
			const { error } = await signup({
				...data,
				age: +age,
			});
			console.log(error);
			if (error) return;
			setCookie("user", { ...data, age: Number(age) }, { maxAge: 60 * 15 }); // 15 minutes
			router.push("/signup/verify");
		} catch (err) {
			console.error("Signup error:", err);
		}
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
				{error && <ErrorMessage message={(error as any)?.data?.message} />}
				<FormField
					control={form.control}
					name="email"
					disabled={isLoading || isSuccess}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Email" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					disabled={isLoading || isSuccess}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="Username" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phonenumber"
					disabled={isLoading || isSuccess}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input placeholder="Phone Number" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="gender"
					disabled={isLoading || isSuccess}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gender</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value || ""}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select Gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="male">Male</SelectItem>
											<SelectItem value="female">Female</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="age"
					disabled={isLoading || isSuccess}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Age</FormLabel>
							<FormControl>
								<Input type="age" placeholder="Age" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					disabled={isLoading || isSuccess}
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
				<FormField
					control={form.control}
					name="confirmPassword"
					disabled={isLoading || isSuccess}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Confirm Password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full"
					disabled={isLoading || isSuccess}
				>
					Sign Up
				</Button>
			</form>
		</Form>
	);
};

export default SignupForm;

"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import { useChangePasswordMutation } from "@/store/api/auth";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	ErrorMessage,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components";

const passwordSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[0-9]/, "Password must contain at least one number")
			.regex(
				/[^a-zA-Z0-9]/,
				"Password must contain at least one special character"
			),
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type PasswordFormInputs = z.infer<typeof passwordSchema>;

const ResetPasswordPage: React.FC = () => {
	const { getCookie, deleteCookie } = useCookiesNext();
	const router = useRouter();
	const [changePassword, { isLoading, isSuccess, error }] =
		useChangePasswordMutation();
	const form = useForm<PasswordFormInputs>({
		resolver: zodResolver(passwordSchema),
		defaultValues: { newPassword: "", confirmPassword: "" },
	});

	const onSubmit = async (data: PasswordFormInputs) => {
		const email = getCookie("forgotEmail");
		if (!email) return;
		const res = await changePassword({
			email: email as string,
			newPassword: data.newPassword,
		});
		if ((res as any).error) return;
		// clean up the cookie and redirect to login
		deleteCookie("forgotEmail");
		router.push("/login");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<h2 className="text-2xl font-bold text-center">Reset password</h2>
					<p className="text-muted-foreground text-center mt-2">
						Enter a new password for your account.
					</p>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							{error && <ErrorMessage message={(error as any).data?.message} />}
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="New password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Confirm password"
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
								Change password
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPasswordPage;

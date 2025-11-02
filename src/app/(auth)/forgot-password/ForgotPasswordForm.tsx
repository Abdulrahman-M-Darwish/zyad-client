"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCookiesNext } from "cookies-next";
import { useForgotPasswordMutation } from "@/store/api/auth";
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

const forgotSchema = z.object({
	email: z.email("Invalid email address"),
});

type ForgotFormInputs = z.infer<typeof forgotSchema>;

const ForgotPasswordForm: React.FC = () => {
	const { setCookie } = useCookiesNext();
	const form = useForm<ForgotFormInputs>({
		resolver: zodResolver(forgotSchema),
		defaultValues: { email: "" },
	});
	const router = useRouter();
	const [forgotPassword, { isLoading, isSuccess, error }] =
		useForgotPasswordMutation();
	const onSubmit = async (data: ForgotFormInputs) => {
		const res = await forgotPassword(data);
		if (res.error) return;
		setCookie("forgotEmail", data.email, { maxAge: 60 * 15 });
		router.push("/forgot-password/verify");
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{error && <ErrorMessage message={(error as any).data?.message} />}
				<FormField
					control={form.control}
					name="email"
					disabled={isLoading || isSuccess}
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
				<Button
					type="submit"
					className="w-full"
					disabled={isLoading || isSuccess}
				>
					Send reset link
				</Button>
			</form>
		</Form>
	);
};

export default ForgotPasswordForm;

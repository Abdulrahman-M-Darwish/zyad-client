"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { useSigninMutation } from "@/store/api/auth";
import { setCookie } from "cookies-next";

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
	const [signin, { isLoading, error }] = useSigninMutation();
	const onSubmit = async (data: LoginFormInputs) => {
		const { data: user, error } = await signin(data);
		if (error) return;
		dispatch(setUser(user.user));
		setCookie("userRole", user.user.role);
		router.replace(user.user.role === "admin" ? "/admin/users" : "/");
	};
	return (
		<Form {...form}>
		
		</Form>
	);
};

export default LoginForm;

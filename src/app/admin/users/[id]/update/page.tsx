/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	ErrorMessage,
} from "@/components";
import { useGetUserQuery, useUpdateUserMutation } from "@/store/api/user";
import Link from "next/link";

const userSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	age: z
		.string()
		.refine(
			(val) => !isNaN(+val) && +val >= 12,
			"Must be at least 12 years old"
		),
	gender: z.enum(["male", "female"], {
		error: "Please select a gender",
	}),
	role: z.enum(["admin", "user"], {
		error: "Please select a role",
	}),
	phonenumber: z.string().min(10, "Phone number is required"),
	password: z.string().optional(),
});

type FormValues = z.infer<typeof userSchema>;

const UpdateUser = () => {
	const params = useParams();
	const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
	const router = useRouter();

	const { data: user, isLoading: isLoadingUser } = useGetUserQuery(
		id ?? skipToken
	);
	const [updateUser, { isLoading: isUpdating, isSuccess, error }] =
		useUpdateUserMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			name: "",
			email: "",
			age: "",
			gender: undefined,
			role: undefined,
			password: "",
			phonenumber: "",
		},
	});

	// Update form when user data is loaded
	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name,
				email: user.email,
				age: String(user.age),
				gender: user.gender,
				role: user.role,
				phonenumber: user.phonenumber,
			});
		}
	}, [user, form]);

	const onSubmit = async ({ password, age, ...data }: FormValues) => {
		if (!id || isUpdating || isSuccess) return;

		try {
			await updateUser({
				id,
				data: {
					...data,
					age: Number(age),
					// Only include password if it was provided
					...(password ? { password: password } : {}),
				},
			}).unwrap();
			router.push(`/admin/users/${id}`);
		} catch (error) {
			console.error("Failed to update user:", error);
		}
	};

	if (isLoadingUser) {
		return <div className="p-6">Loading user details...</div>;
	}

	if (!user) {
		return (
			<div className="p-6">
				<p className="text-red-600">User not found</p>
				<Link href="/admin/users">
					<Button variant="outline" className="mt-4">
						Back
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="p-6 flex items-center min-h-screen">
			<div className="max-w-2xl w-full mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Update User</CardTitle>
						<CardDescription>
							Make changes to {user.name}&apos;s information here.
							{error && <ErrorMessage message={(error as any).data.message} />}
						</CardDescription>
					</CardHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="Full name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="Email address"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="age"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Age</FormLabel>
												<FormControl>
													<Input type="number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="gender"
										defaultValue={user.gender}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Gender</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select gender" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="male">Male</SelectItem>
														<SelectItem value="female">Female</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="role"
										defaultValue={user.role}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Role</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Select role" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="user">User</SelectItem>
														<SelectItem value="admin">Admin</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="phonenumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input placeholder="Phone number" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Leave blank to keep current password"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Only fill this if you want to change the password
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>

							<CardFooter className="flex justify-end space-x-2">
								<Link href="/admin/users">
									<Button variant="outline" disabled={isUpdating || isSuccess}>
										Cancel
									</Button>
								</Link>
								<Button type="submit" disabled={isUpdating || isSuccess}>
									{isUpdating || isSuccess ? "Saving..." : "Save Changes"}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default UpdateUser;

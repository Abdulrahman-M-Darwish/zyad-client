"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea,
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	Button,
} from "@/components";
import {
	useGetLevelQuery,
	useGetLevelsQuery,
	useUpdateLevelMutation,
} from "@/store/api/levels";
import Link from "next/link";

const levelSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	order: z
		.string()
		.refine((val) => !isNaN(+val) && +val > 0, "Order must be greater than 0"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof levelSchema>;

const UpdateLevel = () => {
	const params = useParams();
	const id = params?.id as string;
	const router = useRouter();
	const [updateLevel, { isLoading: isUpdating, isSuccess }] =
		useUpdateLevelMutation();
	const { data: level, isLoading } = useGetLevelQuery(id);
	const { data: levels } = useGetLevelsQuery();

	const form = useForm<FormValues>({
		resolver: zodResolver(levelSchema),
		defaultValues: {
			name: "",
			order: "",
			description: "",
		},
	});

	useEffect(() => {
		if (!level) return;
		form.reset({
			name: level.name,
			order: String(level.order),
			description: level.description || "",
		});
	}, [level, form]);

	const onSubmit = async ({ order, ...data }: FormValues) => {
		if (isLoading || isSuccess) return;
		const { error } = await updateLevel({
			id,
			data: { ...data, order: Number(order) },
		});
		if (!error) router.push(`/admin/levels`);
	};

	if (isLoading) {
		return <div className="p-6">Loading level details...</div>;
	}

	if (!level) {
		return (
			<div className="p-6">
				<p className="text-red-600">Level not found</p>
				<Link href="/admin/levels">
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
						<CardTitle>Update Level</CardTitle>
						<CardDescription>Update an existing level</CardDescription>
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
												<Input placeholder="Level name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="order"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Order</FormLabel>
											<FormControl>
												<Input
													placeholder="Level order"
													type="number"
													max={levels?.length || 1}
													min={1}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea placeholder="Optional description" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>

							<CardFooter className="flex justify-end space-x-2 mt-4">
								<Link href="/admin/levels">
									<Button
										disabled={isUpdating || isSuccess}
										type="button"
										variant="outline"
									>
										Cancel
									</Button>
								</Link>
								<Button type="submit" disabled={isSuccess || isUpdating}>
									{isUpdating || isSuccess ? "Updating..." : "Update Level"}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default UpdateLevel;

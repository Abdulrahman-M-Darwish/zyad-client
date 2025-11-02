"use client";
import { useRouter } from "next/navigation";
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
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	Button,
} from "@/components";
import { useCreateLevelMutation, useGetLevelsQuery } from "@/store/api/levels";
import Link from "next/link";

const levelSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof levelSchema>;

const CreateLevel = () => {
	const router = useRouter();
	const [createLevel, { isLoading, isSuccess }] = useCreateLevelMutation();
	const { data: levels } = useGetLevelsQuery();

	const form = useForm<FormValues>({
		resolver: zodResolver(levelSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		if (isLoading || isSuccess) return;
		try {
			await createLevel({ ...data, order: (levels?.length || 0) + 1 }).unwrap();
			router.push(`/admin/levels`);
		} catch (err) {
			console.error("Failed to create level:", err);
		}
	};

	return (
		<div className="p-6 flex items-center min-h-screen">
			<div className="max-w-2xl w-full mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Create Level</CardTitle>
						<CardDescription>Create a new level</CardDescription>
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
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input placeholder="Optional description" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>

							<CardFooter className="flex justify-end space-x-2 mt-4">
								<Link href="/admin/levels">
									<Button
										disabled={isLoading || isSuccess}
										type="button"
										variant="outline"
									>
										Cancel
									</Button>
								</Link>
								<Button type="submit" disabled={isLoading || isSuccess}>
									{isLoading || isSuccess ? "Creating..." : "Create Level"}
								</Button>
							</CardFooter>
						</form>
					</Form>
				</Card>
			</div>
		</div>
	);
};

export default CreateLevel;

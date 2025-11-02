"use client";
import { useRouter, useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useDeleteLevelMutation, useGetLevelQuery } from "@/store/api/levels";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	Button,
} from "@/components";
import Link from "next/link";

const Level = () => {
	const params = useParams();
	const id = params?.id as string;
	const router = useRouter();
	const [deleteLevel, { isLoading: isDeleting }] = useDeleteLevelMutation();
	const { data: level, isLoading, isError } = useGetLevelQuery(id ?? skipToken);
	const handleDelete = async () => {
		if (!id || isDeleting) return;
		await deleteLevel(id);
		router.push("/admin/levels");
	};

	if (isLoading) {
		return <div className="p-6">Loading level...</div>;
	}

	if (isError || !level) {
		return (
			<div className="p-6">
				<p className="text-red-600">Unable to load level details.</p>
				<Link href="/admin/levels">
					<Button variant="outline" className="mt-4">
						Back
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="p-6 min-h-screen flex items-center">
			<div className="max-w-4xl w-full mx-auto">
				<Card>
					<CardHeader className="flex items-center gap-4 justify-between border-b">
						<div className="mr-auto">
							<CardTitle>{level.name}</CardTitle>
							<CardDescription>Order: {level.order}</CardDescription>
						</div>
						<div className="[data-slot=card-action]">
							<Link href="/admin/levels">
								<Button variant="outline" size="sm">
									Back
								</Button>
							</Link>
						</div>
					</CardHeader>

					<CardContent>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div>
								<dt className="text-sm text-muted-foreground">Name</dt>
								<dd className="text-base font-medium">{level.name}</dd>
							</div>
							<div>
								<dt className="text-sm text-muted-foreground">Description</dt>
								<dd className="text-base font-medium">
									{level.description || "—"}
								</dd>
							</div>

							<div className="space-y-3">
								<div>
									<dt className="text-sm text-muted-foreground">Order</dt>
									<dd className="text-base font-medium">{level.order}</dd>
								</div>
							</div>
						</div>
					</CardContent>

					<CardFooter>
						<div className="ml-auto flex gap-2">
							<Button variant="destructive" onClick={handleDelete}>
								Delete
							</Button>

							<Link href={`/admin/levels/${id}/update`}>
								<Button>Edit</Button>
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Level;

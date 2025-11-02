"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetUserQuery } from "@/store/api/user";
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

const User = () => {
	const params = useParams();
	const id = params?.id;
	const router = useRouter();
	const {
		data: user,
		isLoading,
		isError,
	} = useGetUserQuery((id as string) ?? skipToken);

	if (isLoading) {
		return <div className="p-6">Loading user...</div>;
	}

	if (isError || !user) {
		return (
			<div className="p-6">
				<p className="text-red-600">Unable to load user details.</p>
				<Link href="/admin/users">
					<Button variant="outline" className="mt-4">
						Back
					</Button>
				</Link>
			</div>
		);
	}

	const initials = (user.name || "")
		.split(" ")
		.map((s) => s[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div className="p-6 min-h-screen flex items-center">
			<div className="max-w-4xl w-full mx-auto">
				<Card>
					<CardHeader className="flex items-center gap-4 justify-between">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
							{initials || "U"}
						</div>
						<div className="mr-auto">
							<CardTitle>{user.name}</CardTitle>
							<CardDescription>{user.email}</CardDescription>
						</div>
						<div className="[data-slot=card-action]">
							<Link href="/admin/users">
								<Button variant="outline" size="sm">
									Back
								</Button>
							</Link>
						</div>
					</CardHeader>

					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-3">
								<div>
									<dt className="text-sm text-muted-foreground">Name</dt>
									<dd className="text-base font-medium">{user.name}</dd>
								</div>
								<div>
									<dt className="text-sm text-muted-foreground">Email</dt>
									<dd className="text-base font-medium">{user.email}</dd>
								</div>
								<div>
									<dt className="text-sm text-muted-foreground">Phone</dt>
									<dd className="text-base font-medium">
										{user.phonenumber || "—"}
									</dd>
								</div>
							</div>

							<div className="space-y-3">
								<div>
									<dt className="text-sm text-muted-foreground">Role</dt>
									<dd className="text-base font-medium">{user.role}</dd>
								</div>
								<div>
									<dt className="text-sm text-muted-foreground">Age</dt>
									<dd className="text-base font-medium">{user.age ?? "—"}</dd>
								</div>
								<div>
									<dt className="text-sm text-muted-foreground">Gender</dt>
									<dd className="text-base font-medium">
										{user.gender || "—"}
									</dd>
								</div>
							</div>
						</div>
					</CardContent>

					<CardFooter>
						<div className="ml-auto flex gap-2">
							<Link href={`/admin/users/${id}/update`}>
								<Button>Edit</Button>
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default User;

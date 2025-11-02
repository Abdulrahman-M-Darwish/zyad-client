"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button, DataTable } from "@/components";
import { useGetUsersQuery } from "@/store/api/user";
import { User } from "@/types";

const Users = () => {
	const { data: users = [], isLoading, isError } = useGetUsersQuery();

	const columns = React.useMemo<ColumnDef<User>[]>(
		() => [
			{
				header: "Name",
				accessorKey: "name",
				cell: ({ row, getValue }) => {
					const orig = row.original as unknown as { _id?: string; id?: string };
					const id = orig._id ?? orig.id;
					return (
						<Link
							href={id ? `/admin/users/${id}` : `#`}
							className="text-primary hover:underline"
						>
							{getValue<string>()}
						</Link>
					);
				},
			},
			{
				header: "Email",
				accessorKey: "email",
			},
			{
				header: "Phone",
				accessorKey: "phonenumber",
			},
			{
				header: "Age",
				accessorKey: "age",
			},
			{
				header: "Gender",
				accessorKey: "gender",
			},
			{
				header: "Role",
				accessorKey: "role",
			},
		],
		[]
	);

	if (isLoading) {
		return <div className="p-6">Loading users...</div>;
	}

	if (isError) {
		return <div className="p-6 text-red-600">Failed to load users.</div>;
	}

	return (
		<div className="p-6">
			<div className="flex items-center mb-4">
				<h1 className="text-2xl font-semibold">Users</h1>
				<div className="ml-auto">
					<Link href="/admin/users/create">
						<Button>Create User</Button>
					</Link>
				</div>
			</div>
			<DataTable columns={columns} data={users || []} />
		</div>
	);
};

export default Users;

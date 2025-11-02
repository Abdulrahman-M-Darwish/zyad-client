"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable, Button } from "@/components";
import { useGetLevelsQuery } from "@/store/api/levels";
import { Level } from "@/types";

const Levels = () => {
  const { data: levels = [], isLoading, isError } = useGetLevelsQuery();

  const columns = React.useMemo<ColumnDef<Level>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row, getValue }) => {
          const orig = row.original as unknown as { _id?: string; id?: string };
          const id = orig._id ?? orig.id;
          return (
            <Link
              href={id ? `/admin/levels/${id}` : `#`}
              className="text-primary hover:underline">
              {getValue<string>()}
            </Link>
          );
        },
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: ({ getValue }) => {
          const v = getValue<string | undefined>();
          if (!v) return <span className="text-muted-foreground">—</span>;
          return <span className="truncate max-w-sm">{v}</span>;
        },
      },
      {
        header: "Order",
        accessorKey: "order",
      },
    ],
    []
  );

  if (isLoading) {
    return <div className="p-6">Loading levels...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load levels.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">Levels</h1>
        <div className="ml-auto">
          <Link href="/admin/levels/create">
            <Button>Create Level</Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={levels || []} />
    </div>
  );
};

export default Levels;

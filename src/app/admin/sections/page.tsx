"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable, Button } from "@/components";
import { useGetSectionsQuery } from "@/store/api/sections";
import { Level, Section } from "@/types";

const Sections = () => {
  const { data: sections = [], isLoading, isError } = useGetSectionsQuery();

  const columns = React.useMemo<ColumnDef<Section>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row, getValue }) => {
          const orig = row.original as unknown as { _id?: string; id?: string };
          const id = orig._id ?? orig.id;
          return (
            <Link
              href={id ? `/admin/sections/${id}` : `#`}
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
        header: "Level",
        accessorKey: "level",
        cell: ({ getValue }) => {
          const v = getValue<Level>();
          if (!v) return <span className="text-muted-foreground">—</span>;
          return <span className="truncate max-w-sm">{v.name}</span>;
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
    return <div className="p-6">Loading sections...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load sections.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">Sections</h1>
        <div className="ml-auto">
          <Link href="/admin/sections/create">
            <Button>Create Section</Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={sections || []} />
    </div>
  );
};

export default Sections;

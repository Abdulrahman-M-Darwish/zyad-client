"use client";

import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetLevelQuery } from "@/store/api/levels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useAppSelector } from "@/store/redux";
import { useGetSectionsQuery } from "@/store/api/sections";
import { cn } from "@/lib/utils";

const LevelDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: level,
    isLoading: isLoadingLevel,
    isError: isLevelError,
  } = useGetLevelQuery(id ?? skipToken);
  const user = useAppSelector((state) => state.user.user);
  const { data: sections } = useGetSectionsQuery(id ?? skipToken);

  // Loading state
  if (isLoadingLevel) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isLevelError || !level || !user) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load level details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Find the highest completed level order for locking mechanism
  const highestCompletedOrder = user.completedLevels
    ? Math.max(...user.completedLevels.map((level) => level.order), 0)
    : 0;

  const highestCompletedSectionOrder = user.completedSections
    ? Math.max(
        ...user.completedSections
          .filter((s) => (s.level as unknown as string) === level._id)
          .map((section) => section.order),
        0
      )
    : 0;

  // Check if this level is locked
  const isLocked = level.order > highestCompletedOrder + 1;

  // Check if level is completed
  const isCompleted = user.completedLevels?.some(
    (completedLevel) => completedLevel._id === level._id
  );

  // Sort sections by order
  const sortedSections = sections?.toSorted((a, b) => a.order - b.order) || [];

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{level.name}</h1>
          </div>
          <p className="text-muted-foreground">
            {level.description || "No description available"}
          </p>
        </div>
        <div>
          {isLocked ? (
            <Lock className="h-6 w-6 text-muted-foreground" />
          ) : isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>
            Track your progress through this level&apos;s sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{
                    width: `${
                      ((user.completedSections?.filter((s) =>
                        sections?.some((ls) => ls._id === s._id)
                      ).length || 0) /
                        (sections?.length || 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-right">
                {user.completedSections?.filter((s) =>
                  sections?.some((ls) => ls._id === s._id)
                ).length || 0}{" "}
                / {sections?.length || 0} sections completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections List */}
      {isLocked ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Level Locked</h3>
              <p className="text-sm text-muted-foreground">
                Complete the previous level to unlock this content
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSections.map((section) => {
            const isCompleted = user.completedSections?.some(
              (completedSection) => completedSection._id === section._id
            );
            const isLocked = section.order > highestCompletedSectionOrder + 1;
            return (
              <Link
                href={`/levels/${level._id}/sections/${section._id}`}
                key={section._id}
                className={cn(
                  "block",
                  isLocked && "pointer-events-none opacity-50"
                )}>
                <Card className="transition-colors hover:bg-accent">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {section.description || "No description available"}
                      </p>
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LevelDetails;

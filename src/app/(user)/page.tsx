"use client";
import { useGetLevelsQuery } from "@/store/api/levels";
import { LevelCard } from "@/components/LevelCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store/redux";

export default function Home() {
	const {
		data: levels,
		isLoading: isLoadingLevels,
		isError: isLevelsError,
	} = useGetLevelsQuery();
	const user = useAppSelector((state) => state.user.user);

	if (isLoadingLevels) {
		return (
			<div className="container py-8 space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-4 w-32" />
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-[200px]" />
					))}
				</div>
			</div>
		);
	}

	if (isLevelsError) {
		return (
			<div className="container py-8">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						Failed to load your learning progress. Please try again later.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!levels || !user) {
		return null;
	}

	// Sort levels by order
	const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

	// Find the highest completed level order
	const highestCompletedOrder = user.completedLevels
		? Math.max(...user.completedLevels.map((level) => level.order), 0)
		: 0;

	return (
		<div className="container py-8 space-y-6">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back, {user.name}!
				</h1>
				<p className="text-muted-foreground">
					Continue your learning journey. {"You've"} completed{" "}
					{user.completedLevels?.length || 0} out of {levels.length} levels.
				</p>
			</div>

			{/* Progress Overview */}
			<Card>
				<CardHeader>
					<CardTitle>Your Progress</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4">
						<div className="flex-1 space-y-1">
							<div className="h-2 w-full rounded-full bg-secondary">
								<div
									className="h-2 rounded-full bg-primary"
									style={{
										width: `${
											((user.completedLevels?.length || 0) / levels.length) *
											100
										}%`,
									}}
								/>
							</div>
							<p className="text-sm text-muted-foreground text-right">
								{Math.round(
									((user.completedLevels?.length || 0) / levels.length) * 100
								)}
								% Complete
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Levels Grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{sortedLevels.map((level) => {
					const isCompleted = user.completedLevels?.some(
						(completedLevel) => completedLevel._id === level._id
					);
					const isLocked = level.order > highestCompletedOrder + 1;

					return (
						<LevelCard
							key={level._id}
							level={level}
							isCompleted={isCompleted}
							isLocked={isLocked}
						/>
					);
				})}
			</div>
		</div>
	);
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Level } from "@/types";
import { Lock, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

interface LevelCardProps {
  level: Level;
  isCompleted: boolean;
  isLocked: boolean;
}

export const LevelCard = ({ level, isCompleted, isLocked }: LevelCardProps) => {
  return (
    <Link
      href={`/levels/${level._id}`}
      className={isLocked ? "pointer-events-none" : ""}>
      <Card className={`${isLocked ? "opacity-75" : ""}`}>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">{level.name}</CardTitle>
          <div>
            {isLocked ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {level.description || "No description available"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

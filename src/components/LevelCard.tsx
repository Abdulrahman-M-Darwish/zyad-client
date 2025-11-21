"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Level } from "@/types";
import { Lock, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LevelCardProps {
  level: Level;
  isCompleted: boolean;
  isLocked: boolean;
}

const getPhaseImage = (levelName: string): string => {
  if (levelName.toLowerCase().includes("phase 1")) {
    return "/phase-1.jpg";
  } else if (levelName.toLowerCase().includes("phase 2")) {
    return "/phase-2.jpg";
  } else if (levelName.toLowerCase().includes("phase 3")) {
    return "/phase-3.jpg";
  }
  return "/phase-1.jpg";
};

export const LevelCard = ({ level, isCompleted, isLocked }: LevelCardProps) => {
  const phaseImage = getPhaseImage(level.name);

  return (
    <Link
      href={`/levels/${level._id}`}
      className={isLocked ? "pointer-events-none" : ""}
    >
      <Card
        className={`overflow-hidden transition-all hover:shadow-lg ${
          isLocked ? "opacity-75" : ""
        }`}
      >
        <div className="relative w-full h-48 bg-gradient-to-br from-primary/5 to-transparent">
          <Image
            src={phaseImage}
            alt={level.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
            {isLocked ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">{level.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {level.description || "No description available"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

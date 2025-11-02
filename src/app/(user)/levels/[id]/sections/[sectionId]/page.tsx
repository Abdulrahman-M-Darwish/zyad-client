"use client";

import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetSectionQuery, useGetSectionsQuery } from "@/store/api/sections";
import { useLazyGetMeQuery, useUpdateUserMutation } from "@/store/api/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CldVideoPlayer } from "next-cloudinary";
import { useState } from "react";
import "next-cloudinary/dist/cld-video-player.css";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { setUser } from "@/store/features/userSlice";
import { downloadCloudinaryVideo } from "@/lib/utils";

const SectionDetails = () => {
  const params = useParams();
  const id = params?.sectionId as string;
  const levelId = params?.id as string;
  const router = useRouter();
  const [hasWatched, setHasWatched] = useState(false);

  const { data: sections } = useGetSectionsQuery(levelId ?? skipToken);
  const {
    data: section,
    isLoading: isLoadingSection,
    isError: isSectionError,
  } = useGetSectionQuery(id ?? skipToken);
  const user = useAppSelector((state) => state.user.user);
  const [updateUser] = useUpdateUserMutation();
  const [getUser] = useLazyGetMeQuery();
  const isCompleted = user?.completedSections?.map((s) => s._id).includes(id);
  const dispatch = useAppDispatch();

  // Loading state
  if (isLoadingSection) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="aspect-video w-full max-w-4xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (isSectionError || !section || !user) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load section details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if this is the last section in the level
  const isLastSection = sections?.length === section.order;

  const handleVideoComplete = async () => {
    if (isCompleted) return;

    await updateUser({
      id: user._id,
      data: {
        completedSections: [
          ...(user.completedSections.map((s) => s._id) || []),
          section._id,
        ],
        ...(isLastSection
          ? {
              completedLevels: [
                ...new Set([
                  ...user.completedLevels.map((l) => l._id),
                  levelId,
                ]),
              ],
            }
          : {}),
      },
    });
    const updatedUser = await getUser().unwrap();
    dispatch(setUser(updatedUser));
    setHasWatched(true);
  };

  const handleNext = () => {
    if (isLastSection) {
      // If it's the last section, go back to the level page
      router.push(`/levels/${section.level._id}`);
    } else {
      // Find the next section in the level
      const nextSection = sections?.find((s) => s.order === section.order + 1);
      if (nextSection) {
        router.push(`/levels/${levelId}/sections/${nextSection._id}`);
      }
    }
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={`/levels/${section.level._id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {section.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Level:{" "}
            <Link
              href={`/levels/${section.level._id}`}
              className="hover:underline">
              {section.level.name}
            </Link>
          </p>
        </div>
      </div>

      {/* Video Player Card */}
      <div className="space-y-2 flex flex-col">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {section.videoId && (
              <div className="aspect-video">
                <CldVideoPlayer
                  width="1920"
                  height="1080"
                  src={section.videoId}
                  autoPlay="never"
                  className="w-full h-full"
                  onEnded={handleVideoComplete}
                />
              </div>
            )}
          </CardContent>
        </Card>
        <Button
          className="ml-auto"
          onClick={() =>
            downloadCloudinaryVideo(section.videoId, section.name)
          }>
          <Download />
          Download Video
        </Button>
      </div>

      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>Section Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {section.description || "No description available"}
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Link href={`/levels/${section.level._id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Level
          </Button>
        </Link>

        <Button
          onClick={handleNext}
          disabled={!hasWatched && !isCompleted}
          className="group">
          {(hasWatched || isCompleted) && (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          )}
          {isLastSection ? "Complete Level" : "Next Section"}
          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>

      {/* Locked State Overlay */}
      {!hasWatched && !isCompleted && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Watch the Video</AlertTitle>
          <AlertDescription>
            Please watch the video to continue to the next section.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SectionDetails;

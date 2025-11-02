"use client";
import { useRouter, useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { CldVideoPlayer } from "next-cloudinary";
import { downloadCloudinaryVideo } from "@/lib/utils";
import {
  useDeleteSectionMutation,
  useGetSectionQuery,
} from "@/store/api/sections";
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
import "next-cloudinary/dist/cld-video-player.css";
import { Download } from "lucide-react";

const Section = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [deleteSection, { isLoading: isDeleting }] = useDeleteSectionMutation();
  const {
    data: section,
    isLoading,
    isError,
  } = useGetSectionQuery(id ?? skipToken);
  const handleDelete = async () => {
    if (!id || isDeleting) return;
    await deleteSection({ id, order: section?.order || 1 });
    router.push("/admin/sections");
  };

  if (isLoading) {
    return <div className="p-6">Loading section...</div>;
  }

  if (isError || !section) {
    return (
      <div className="p-6">
        <p className="text-red-600">Unable to load section details.</p>
        <Link href="/admin/sections">
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
          <CardHeader className="flex items-center gap-4 justify-between">
            <div className="mr-auto">
              <CardTitle>{section.name}</CardTitle>
              <CardDescription>Order: {section.order}</CardDescription>
            </div>
            <div className="[data-slot=card-action]">
              <Link href="/admin/sections">
                <Button variant="outline" size="sm">
                  Back
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.videoId && (
                <div className="col-span-full mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <dt className="text-sm text-muted-foreground">Video</dt>
                  </div>
                  <dd className="aspect-video w-full">
                    <CldVideoPlayer
                      width="1920"
                      height="1080"
                      src={section.videoId}
                      autoPlay="never"
                      className="w-full h-full rounded-lg overflow-hidden"
                    />
                    <div className="flex">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 ml-auto"
                        onClick={() => {
                          downloadCloudinaryVideo(
                            section.videoId,
                            section.name
                          ).catch((error) => {
                            console.error("Download failed:", error);
                          });
                        }}>
                        <Download />
                        Download Video
                      </Button>
                    </div>
                  </dd>
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd className="text-base font-medium">{section.name}</dd>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Order</dt>
                  <dd className="text-base font-medium">{section.order}</dd>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Description</dt>
                  <dd className="text-base font-medium">
                    {section.description || "—"}
                  </dd>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="ml-auto flex gap-2">
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>

              <Link href={`/admin/sections/${id}/update`}>
                <Button>Edit</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Section;

"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from "@/components";
import {
  useGetSectionQuery,
  useUpdateSectionMutation,
} from "@/store/api/sections";
import Link from "next/link";
import {
  CldUploadWidget,
  CldVideoPlayer,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const sectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  order: z
    .string()
    .refine((val) => !isNaN(+val) && +val > 0, "Order must be greater than 0"),
  videoId: z.string({ error: "Upload a video" }).min(1, "Upload a video"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof sectionSchema>;

const UpdateSection = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [updateSection, { isLoading: isUpdating, isSuccess }] =
    useUpdateSectionMutation();
  const { data: section, isLoading } = useGetSectionQuery(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      order: "",
      description: "",
      videoId: "",
    },
  });

  useEffect(() => {
    form.watch();
    if (!section) return;
    form.reset({
      name: section.name,
      order: String(section.order),
      videoId: section.videoId,
      description: section.description || "",
    });
  }, [section, form]);

  const onSubmit = async ({ order, ...data }: FormValues) => {
    if (isLoading || isSuccess) return;
    const { error } = await updateSection({
      id,
      data: { ...data, order: Number(order) },
    });
    if (!error) router.push(`/admin/sections`);
  };

  if (isLoading) {
    return <div className="p-6">Loading section details...</div>;
  }

  if (!section) {
    return (
      <div className="p-6">
        <p className="text-red-600">Section not found</p>
        <Link href="/admin/sections">
          <Button variant="outline" className="mt-4">
            Back
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 flex items-center min-h-screen">
      <div className="max-w-2xl w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Update Section</CardTitle>
            <CardDescription>Update an existing section</CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {section.videoId && (
                  <div>
                    <dt className="text-sm text-muted-foreground mb-2">
                      Video
                    </dt>
                    <dd className="aspect-video w-full">
                      <CldVideoPlayer
                        width="1920"
                        height="1080"
                        src={form.getValues("videoId") || section.videoId}
                        autoPlay="never"
                        className="w-full h-full rounded-lg overflow-hidden"
                      />
                    </dd>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Section name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CldUploadWidget
                  uploadPreset="videos"
                  onSuccess={(res) => {
                    form.setValue(
                      "videoId",
                      (res.info as CloudinaryUploadWidgetInfo)!.public_id
                    );
                  }}>
                  {({ open }) => {
                    return (
                      <>
                        <Button
                          type="button"
                          onClick={() => open()}
                          className="w-full">
                          {form.getValues("videoId")
                            ? "Video Uploaded"
                            : "Choose Video to Upload"}
                        </Button>
                      </>
                    );
                  }}
                </CldUploadWidget>
              </CardContent>

              <CardFooter className="flex justify-end space-x-2 mt-4">
                <Link href="/admin/sections">
                  <Button
                    disabled={isUpdating || isSuccess}
                    type="button"
                    variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isSuccess || isUpdating}>
                  {isUpdating || isSuccess ? "Updating..." : "Update Section"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateSection;

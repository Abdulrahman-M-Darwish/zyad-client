"use client";
import { useRouter } from "next/navigation";
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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  SelectItem,
  SelectContent,
  Select,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  ErrorMessage,
} from "@/components";
import {
  useCreateSectionMutation,
  useGetSectionsQuery,
} from "@/store/api/sections";
import Link from "next/link";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { useGetLevelsQuery } from "@/store/api/levels";

const sectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  level: z.string({ error: "Choose a level" }).min(1, "Choose a level"),
  description: z.string().optional(),
  videoId: z.string({ error: "Upload a video" }).min(1, "Upload a video"),
});

type FormValues = z.infer<typeof sectionSchema>;

const CreateSection = () => {
  const router = useRouter();
  const [createSection, { isLoading, isSuccess }] = useCreateSectionMutation();
  const { data: sections } = useGetSectionsQuery();
  const {
    data: levels,
    isLoading: isLoadingLevels,
    isFetching,
  } = useGetLevelsQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      videoId: undefined,
      description: "",
      level: undefined,
    },
  });
  form.watch();
  const onSubmit = async ({ ...data }: FormValues) => {
    if (isLoading || isSuccess) return;
    try {
      await createSection({
        ...data,
        order: (sections?.length || 0) + 1,
      }).unwrap();
      router.push(`/admin/sections`);
    } catch (err) {
      console.error("Failed to create section:", err);
    }
  };

  return (
    <div className="p-6 flex items-center min-h-screen">
      <div className="max-w-2xl w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Section</CardTitle>
            <CardDescription>Create a new section</CardDescription>
            {form.getFieldState("videoId").error?.message && (
              <ErrorMessage
                message={form.getFieldState("videoId").error!.message!}
              />
            )}
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isLoadingLevels || isFetching
                                  ? "Loading..."
                                  : "Select level"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectGroup>
                            {levels && levels.length > 0 ? (
                              levels.map((lvl) => (
                                <SelectItem key={lvl._id} value={lvl._id}>
                                  {lvl.name}
                                </SelectItem>
                              ))
                            ) : isLoadingLevels ? (
                              <SelectLabel>Loading...</SelectLabel>
                            ) : (
                              <SelectLabel>No levels available</SelectLabel>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
                    disabled={isLoading || isSuccess}
                    type="button"
                    variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading || isSuccess}>
                  {isLoading || isSuccess ? "Creating..." : "Create Section"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateSection;

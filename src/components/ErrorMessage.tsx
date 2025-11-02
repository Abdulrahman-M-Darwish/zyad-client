import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const ErrorMessage = ({
  message = "something went wrong please try again later",
}: {
  message: string;
}) => {
  return (
    <Alert variant="destructive" className="mt-4 bg-red-500 text-white">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="!text-white">{message}</AlertDescription>
    </Alert>
  );
};

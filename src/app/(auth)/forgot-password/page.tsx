import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Card, CardContent, CardHeader } from "@/components";

export const metadata = {
	title: "Forgot Password",
};

export default function Page() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-muted px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<h2 className="text-2xl font-bold text-center">Forgot password</h2>
					<p className="text-muted-foreground text-center mt-2">
						Enter your email and we'll send you a link to reset your password.
					</p>
				</CardHeader>
				<CardContent>
					<ForgotPasswordForm />
				</CardContent>
			</Card>
		</div>
	);
}

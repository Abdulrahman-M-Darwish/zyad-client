/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useSignupMutation, useVerifyMutation } from "@/store/api/auth";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	ErrorMessage,
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components";

const Verify = () => {
	const [otp, setOtp] = useState("");
	const [verify, { error, isLoading, isSuccess }] = useVerifyMutation();
	const [cooldown, setCooldown] = useState(60);
	const [resend, { isLoading: isResending, error: resendError }] =
		useSignupMutation();
	const handleResend = async () => {
		const user = getCookie("user");
		const res = await resend(JSON.parse(user as any));
		if (!res.error) setCooldown(60);
	};
	const { getCookie, deleteCookie } = useCookiesNext();
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const user = getCookie("user");
		const { error } = await verify({ otp, ...JSON.parse(user as any) });
		if (error) return;
		deleteCookie("user");
		router.push("/login");
	};
	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
		return () => clearInterval(t);
	}, [cooldown]);
	return (
		<div className="flex items-center justify-center min-h-screen bg-muted px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<h2 className="text-2xl font-bold text-center">Email Verification</h2>
					<p className="text-muted-foreground text-center mt-2">
						Enter the OTP sent to your email to verify your account.
					</p>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-4 flex flex-col items-center"
					>
						<InputOTP
							maxLength={6}
							value={otp}
							onChange={(value) => setOtp(value)}
							pattern={REGEXP_ONLY_DIGITS}
							disabled={isLoading || isSuccess}
						>
							<InputOTPGroup>
								<InputOTPSlot className="text-lg w-12 h-12" index={0} />
								<InputOTPSlot className="text-lg w-12 h-12" index={1} />
								<InputOTPSlot className="text-lg w-12 h-12" index={2} />
							</InputOTPGroup>
							<InputOTPSeparator />
							<InputOTPGroup>
								<InputOTPSlot className="text-lg w-12 h-12" index={3} />
								<InputOTPSlot className="text-lg w-12 h-12" index={4} />
								<InputOTPSlot className="text-lg w-12 h-12" index={5} />
							</InputOTPGroup>
						</InputOTP>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading || isSuccess}
						>
							{isLoading ? "Verifying..." : "Verify"}
						</Button>
					</form>
					{error && <ErrorMessage message={(error as any).data.message} />}
				</CardContent>
				<CardFooter className="flex flex-col gap-2 items-center text-center text-xs text-muted-foreground">
					<div>Didn’t receive the code? Check your spam folder.</div>
					<div className="flex items-center gap-2">
						<button
							type="button"
							className={`text-sm underline ${
								cooldown > 0 || isResending
									? "text-gray-400 cursor-not-allowed"
									: "text-blue-600 hover:text-blue-800"
							}`}
							onClick={handleResend}
							disabled={cooldown > 0 || isResending}
						>
							{isResending
								? "Resending..."
								: cooldown > 0
								? `Resend (${cooldown}s)`
								: "Resend code"}
						</button>
						{resendError && (
							<span className="text-red-500 text-xs">
								{(resendError as any).data?.message || "Unable to resend"}
							</span>
						)}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Verify;

import LoginForm from "./LoginForm";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
	return (
		<div className="min-h-screen flex flex-col md:flex-row justify-center">
			{/* Left: Image/Branding */}
			<div className="hidden md:flex md:w-1/2 items-center justify-center relative">
				<Image
					fill
					src="/call-to-action.jpg"
					alt="Real Estate"
					className="object-cover object-center"
				/>
			</div>
			{/* Right: Form */}
			<div className="flex w-full md:w-1/2 items-center justify-center p-8">
				<div className="max-w-md w-full space-y-8">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold">Welcome Back</h1>
						<p className="mt-2">Log in to manage your properties</p>
					</div>
					<LoginForm />
					<p className="text-center text-sm mt-4">
						{"Don't"} have an account?{" "}
						<Link href="/signup" className="text-blue-400 hover:underline">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;

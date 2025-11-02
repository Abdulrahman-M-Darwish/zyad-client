import SignupForm from "./SignupForm";
import Image from "next/image";
import Link from "next/link";

const Signup = () => {
	return (
		<div className="min-h-screen flex flex-col md:flex-row justify-center">
			{/* Left: Image/Branding */}
			<div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center relative">
				<Image
					fill
					src="/landing-discover-bg.jpg"
					unoptimized
					alt="Real Estate"
					className="object-cover object-center brightness-[40%]"
				/>
			</div>
			{/* Right: Form */}
			<div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white">
				<div className="max-w-md w-full space-y-8">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-gray-900">
							Create your account
						</h1>
						<p className="mt-2 text-gray-500">
							Sign up to find your dream home
						</p>
					</div>
					<SignupForm />
					<p className="text-center text-sm text-gray-500 mt-4">
						Already have an account?{" "}
						<Link href="/login" className="text-blue-600 hover:underline">
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signup;

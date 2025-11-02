import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
	imageSrc: string;
	title: string;
	description: string;
	linkText: string;
	linkHref: string;
};

export const FeatureCard: React.FC<Props> = ({
	description,
	imageSrc,
	linkHref,
	linkText,
	title,
}) => {
	return (
		<div className="text-center">
			<div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48">
				<Image
					src={imageSrc}
					width={400}
					height={400}
					alt={title}
					className="w-full h-full object-contain"
				/>
			</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="mb-4">{description}</p>
			<Link
				href={linkHref}
				scroll={false}
				className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
			>
				{linkText}
			</Link>
		</div>
	);
};

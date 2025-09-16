import { cn } from "@/lib/utils";

interface CustomSectionProps {
	children: React.ReactNode;
	container?: boolean;
	sectionColor?: boolean;
	id?: string;
	className?: string;
	minHeight?: boolean;
}

export function CustomSection({
	children,
	className,
	container = false,
	sectionColor,
	id,
	minHeight = true,
}: CustomSectionProps) {
	return (
		<section
			id={id}
			className={cn(
				"flex flex-col gap-4 w-full pt-28 overflow-hidden px-0",
				"md:pt-40",
				sectionColor && "bg-radial-[at_25%_25%] from-blue-800 to-blue-950 to-75%",
				minHeight && "min-h-[100dvh]",
				className,
			)}
		>
			<div className={cn("px-4 md:px-0", container && "container mx-auto")}>{children}</div>
		</section>
	);
}

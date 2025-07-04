import { useId } from "react";

export function Features() {
	return (
		<div className="py-2">
			<div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
				{grid.map((feature, i) => (
					<div
						key={feature.title}
						className="relative bg-gradient-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white px-6 py-2 overflow-hidden"
					>
						<Grid size={i * 5 + 10} />
						<p className="text-base font-bold text-neutral-800 dark:text-white relative z-0">
							{feature.title}
						</p>
						<p className="text-neutral-600 dark:text-neutral-400 text-base font-normal relative z-0">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

const grid = [
	{
		title: "Secure Authentication",
		description: "Generate and manage secure tokens for API access."
	},
	{
		title: "Initiate M-Pesa Payments",
		description: "Effortlessly trigger M-Pesa payments to your customers via STK Push."
	},
	{
		title: "Receive Customer Payments",
		description: "Register URLs to receive customer payments through C2B channels."
	},
	{
		title: "Send Business Payments",
		description: "Easily send payments from your business to customers using B2C Payouts."
	},
	{
		title: "Robust Error Handling",
		description: "Benefit from centralized and consistent error management for reliability."
	},
	{
		title: "Automatic Retries",
		description: "Request handling with automatic retries for improved success rates."
	},
	{
		title: "Configurable Logging",
		description: "Tailor log levels to your needs (Emergency upto Debug) for optimal debugging and monitoring."
	},
	{
		title: "Efficient Pagination Support",
		description: "Handles paginated responses"
	}
];

export const Grid = ({
	pattern,
	size,
}: {
	pattern?: number[][];
	size?: number;
}) => {
	const p = pattern ?? [
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
		[Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
	];
	return (
		<div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
			<div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
				<GridPattern
					width={size ?? 20}
					height={size ?? 20}
					x="-12"
					y="4"
					squares={p}
					className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
				/>
			</div>
		</div>
	);
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
	const patternId = useId();

	return (
		<svg aria-hidden="true" {...props}>
			<defs>
				<pattern
					id={patternId}
					width={width}
					height={height}
					patternUnits="userSpaceOnUse"
					x={x}
					y={y}
				>
					<path d={`M.5 ${height}V.5H${width}`} fill="none" />
				</pattern>
			</defs>
			<rect
				width="100%"
				height="100%"
				strokeWidth={0}
				fill={`url(#${patternId})`}
			/>
			{squares && (
				<svg x={x} y={y} className="overflow-visible">
					{squares.map(([x, y]: any, _: number) => (
						<rect
							strokeWidth="0"
							key={`${x}-${y} ${_}`}
							width={width + 1}
							height={height + 1}
							x={x * width}
							y={y * height}
						/>
					))}
				</svg>
			)}
		</svg>
	);
}

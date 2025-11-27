import type { ReactNode } from "react";

type PillProps = {
	children: ReactNode;
};

export function RealtimePill({ children }: PillProps) {
	return (
		<span
			style={{
				backgroundColor: "#f9d59aff",
				borderRadius: "9999px",
				padding: "0.1rem 0.5rem",
				fontSize: "12px",
				margin: "0 8px",
				fontWeight: 500,
				display: "inline-block",
			}}
		>
			{children}
		</span>
	);
}

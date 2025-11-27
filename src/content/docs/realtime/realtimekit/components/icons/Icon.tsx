import type { SVGProps } from "react";
import icons from "./icons.json";

const ICONS = icons as Record<
	string,
	{
		viewBox: string;
		paths: string[];
	}
>;

export type IconName = keyof typeof ICONS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
	name: IconName;
	onClick?: () => void;
	className?: string;
}

export function Icon({ name, className, onClick, ...rest }: IconProps) {
	const icon = ICONS[name];

	if (!icon) {
		return null;
	}

	return (
		<div onClick={onClick}>
			<svg
				aria-hidden="true"
				focusable="false"
				viewBox={icon.viewBox}
				className={className}
				{...rest}
			>
				{icon.paths.map((d, index) => (
					<path key={index} d={d} />
				))}
			</svg>
		</div>
	);
}

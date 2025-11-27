import type { ReactNode } from "react";
import { useFramework } from "../hooks/useFramework";

interface CodeSnippetProps {
	id: string; // e.g. "web-react"
	children: ReactNode; // MDX content
}

export default function CodeSnippet({ id, children }: CodeSnippetProps) {
	const { platform, framework } = useFramework();

	if (!framework) return null;

	const activeId = `${platform}-${framework.id}`;

	return <div className={activeId === id ? "" : "hidden"}>{children}</div>;
}

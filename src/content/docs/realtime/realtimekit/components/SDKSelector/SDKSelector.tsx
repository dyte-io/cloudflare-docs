import { useEffect, useMemo, useState } from "react";
import { Icon } from "../icons/Icon";

const STORAGE_KEY = "realtimekit-sdk-selector";

type Platform = "web" | "mobile";

type Framework = {
	id: string;
	label: string;
	curl: string;
	template: string;
};

interface SDKSelectorProps {
	showInstallationHelpers?: boolean;
}

export default function SDKSelector({
	showInstallationHelpers = false,
}: SDKSelectorProps) {
	const [platform, setPlatform] = useState<Platform>("web");
	const [framework, setFramework] = useState<Framework | undefined>(undefined);

	const webFrameworks: Framework[] = [
		{
			id: "react",
			label: "React",
			curl: "npm i @cloudflare/realtimekit-react @cloudflare/realtimekit-react-ui",
			template: `git clone https://github.com/cloudflare/realtimekit-web-examples.git \n&& cd realtimekit-web-examples/react-examples/examples/default-meeting-ui`,
		},
		{
			id: "web-components",
			label: "Web Components (HTML)",
			curl: "npm i @cloudflare/realtimekit-web @cloudflare/realtimekit-ui",
			template: `git clone https://github.com/cloudflare/realtimekit-web-examples.git \n&& cd realtimekit-web-examples/html-examples/examples/default-meeting-ui`,
		},
		{
			id: "angular",
			label: "Angular",
			curl: "npm i @cloudflare/realtimekit-angular @cloudflare/realtimekit-angular-ui",
			template: `git clone https://github.com/cloudflare/realtimekit-web-examples.git \n&& cd realtimekit-web-examples/angular-examples/examples/default-meeting-ui`,
		},
	];
	const mobileFrameworks: Framework[] = [
		{
			id: "react-native",
			label: "React Native",
			curl: "",
			template: "",
		},
		{
			id: "android",
			label: "Android",
			curl: "",
			template: "",
		},
		{
			id: "ios",
			label: "iOS",
			curl: "",
			template: "",
		},
		{
			id: "flutter",
			label: "Flutter",
			curl: "",
			template: "",
		},
	];
	const platforms: {
		label: string;
		id: Platform;
	}[] = [
		{
			label: "Web",
			id: "web",
		},
		{
			label: "Mobile",
			id: "mobile",
		},
	];

	const frameworks = useMemo(
		() => (platform === "web" ? webFrameworks : mobileFrameworks),
		[platform],
	);

	// Initialise selection from localStorage (if available) on first render.
	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as {
					platform?: Platform;
					frameworkId?: string;
				};

				const storedPlatform: Platform =
					parsed.platform === "mobile" ? "mobile" : "web";
				const availableFrameworks =
					storedPlatform === "web" ? webFrameworks : mobileFrameworks;
				const selectedFromStore = availableFrameworks.find(
					(fw) => fw.id === parsed.frameworkId,
				);

				setPlatform(storedPlatform);
				setFramework(selectedFromStore ?? availableFrameworks[0]);
				return;
			}
		} catch {
			// Ignore JSON or storage errors and fall back to defaults.
		}

		// No stored selection: default to web and its first framework.
		setPlatform("web");
		setFramework(webFrameworks[0]);
	}, []);

	return (
		<>
			<div className="flex flex-col gap-0 rounded-md bg-blue-100 p-2 dark:bg-neutral-800">
				<div className="flex w-full flex-row items-start justify-start gap-2">
					{platforms.map((p) => (
						<button
							type="button"
							className={`m-0 ${p.id === platform ? "rounded-t-md bg-neutral-50 text-blue-500 dark:bg-neutral-700" : "bg-blue-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"} cursor-pointer px-2 py-1 font-medium`}
							onClick={() => {
								const nextPlatform = p.id;
								const nextFramework =
									nextPlatform === "web"
										? webFrameworks[0]
										: mobileFrameworks[0];

								setPlatform(nextPlatform);
								setFramework(nextFramework);

								if (typeof window !== "undefined" && nextFramework) {
									try {
										window.localStorage.setItem(
											STORAGE_KEY,
											JSON.stringify({
												platform: nextPlatform,
												frameworkId: nextFramework.id,
											}),
										);
									} catch {
										// Ignore storage errors.
									}
								}
							}}
							key={p.id}
						>
							{p.label}
						</button>
					))}
				</div>
				{frameworks.length < 1 && (
					<div className="m-0 w-full rounded-r-md rounded-b-md bg-neutral-50 p-4 text-sm text-gray-500 italic dark:bg-neutral-700 dark:text-gray-400">
						No frameworks available.
					</div>
				)}
				<div className="m-0 flex w-full flex-row items-center gap-2 rounded-r-md rounded-b-md bg-neutral-50 p-2 text-gray-500 dark:bg-neutral-700 dark:text-gray-400">
					{frameworks.map((fw) => {
						const handleClick = () => {
							setFramework(fw);

							if (typeof window !== "undefined") {
								try {
									window.localStorage.setItem(
										STORAGE_KEY,
										JSON.stringify({ platform, frameworkId: fw.id }),
									);
								} catch {
									// Ignore storage errors.
								}
							}
						};

						return (
							<button
								key={fw.id}
								type="button"
								className={`m-0 flex ${framework?.id === fw.id ? "text-blue-500 italic" : ""} text-md cursor-pointer items-center rounded-md bg-neutral-50 px-3 py-1 font-medium dark:bg-neutral-700`}
								onClick={handleClick}
							>
								{fw.label}
							</button>
						);
					})}
				</div>
			</div>

			{showInstallationHelpers && framework && (
				<div className="text-md mt-3 gap-3">
					<p>
						Please install the following dependancies into your project
						repository:
					</p>
					<pre className="text-md flex items-center justify-between overflow-x-auto rounded border border-neutral-300 bg-gray-100 p-3 font-mono leading-snug dark:border-neutral-600 dark:bg-neutral-800">
						<code>{framework.curl}</code>
						<Icon
							name="copy"
							className="h-6 w-6 cursor-pointer fill-neutral-500 hover:fill-neutral-400"
							onClick={async () => {
								if (typeof navigator === "undefined" || !navigator.clipboard)
									return;
								try {
									await navigator.clipboard.writeText(framework.curl);
								} catch {
									// Ignore clipboard errors.
								}
							}}
						/>
					</pre>
					<p>
						<i>Optional:</i> You can also build on top of our ready-made
						template:
					</p>
					<pre className="text-md flex items-center justify-between overflow-x-auto rounded border border-neutral-300 bg-gray-100 p-3 font-mono leading-snug dark:border-neutral-600 dark:bg-neutral-800">
						<code>{framework.template}</code>
						<Icon
							name="copy"
							className="h-6 w-6 cursor-pointer fill-neutral-500 hover:fill-neutral-400"
							onClick={async () => {
								if (typeof navigator === "undefined" || !navigator.clipboard)
									return;
								try {
									await navigator.clipboard.writeText(framework.curl);
								} catch {
									// Ignore clipboard errors.
								}
							}}
						/>
					</pre>
				</div>
			)}
		</>
	);
}

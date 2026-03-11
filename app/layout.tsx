import "@styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "vishwas rallapalli",
	description: "My Personal Portfolio",
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body suppressHydrationWarning={true}>{children}</body>
		</html>
	);
}

import type { Metadata } from "next";
import "./learning.css";

export const metadata: Metadata = {
	title: "NXGENVARSITY × PRERANA",
	description: "Learn, explore and excel in the world of technology.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

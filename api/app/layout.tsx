/**
 * @file app/layout.tsx
 * @description Root layout for the QuantoTa? API application.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuantoTa? API",
  description: "Live football scores API — QuantoTa?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

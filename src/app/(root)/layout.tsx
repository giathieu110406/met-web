import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex min-h-dvh w-full items-center justify-center antialiased bg-cover bg-center bg-no-repeat overflow-hidden select-none"
      style={{
        backgroundImage: "url('/web-bg.jpg')",
        backgroundColor: '#161426',
      }}
    >
      {/* Gentle vignette and soft atmospheric overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-slate-950/25"
        style={{
          boxShadow: 'inset 0 0 100px rgba(10, 8, 20, 0.6)',
        }}
      />
      <div className="relative z-10 flex min-h-dvh w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

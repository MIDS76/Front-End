"use client";

import React from "react";
interface InfoCardProps {
  titulo: string;
  search?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; 
}

export default function InfoCard({ 
    titulo,
    search, 
    className, 
    style 
    }: InfoCardProps) {
  return (
    <div
      className={`rounded-2xl desktop shadow p-[1rem] ${className}`}
      style={{
        backgroundColor: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        ...style, 
      }}
    >
      <h5 className="text-[1.875rem] font-semibold">{titulo}</h5>

      <div
        className="my-[0.5rem]"
        style={{ borderBottom: "1px solid hsl(var(--border))" }}
      />

      {search && <div className="mb-4">{search}</div>}
      
    </div>
  );
}

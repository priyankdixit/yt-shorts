"use client";

import React, { useState, useEffect, useRef } from "react";
import ShortCard from "@/components/shorts/short-card";

type ShortType = {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: Date;
  updateAt: Date;
  userId: string;
  viewsCount: number;
  user: {
    name: string;
    email: string;
  };
};

interface ShortsListProps {
  initialShorts: ShortType[];
}

export default function ShortsList({ initialShorts }: ShortsListProps) {
  const [shorts, setShorts] = useState<ShortType[]>(initialShorts || []);
  const [activeShortId, setActiveShortId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-id");
            if (id) setActiveShortId(id);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.7,
      }
    );

    const items = containerRef.current.querySelectorAll<HTMLDivElement>(".short-wrapper");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, [shorts]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      <div className="flex flex-col items-center">
        {shorts.map((short: ShortType) => (
          <div
            key={short.id}
            data-id={short.id}
            className="short-wrapper snap-start flex justify-center items-center h-screen"
          >
            <ShortCard short={short} isActive={activeShortId === short.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useSearchParams } from "next/navigation";
import { JSX } from "react/jsx-dev-runtime";

export default function PropertiesPage(): JSX.Element {
  const params = useSearchParams();
  const search = params.get("search");

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Showing results for: {search}
      </h1>
    </div>
  );
}
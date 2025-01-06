import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatarName(name: string) {
  if (!name?.trim()) {
    return "?";
  }
  // Clean the name string
  const cleanName = name.replace(/[^a-zA-Z\s]/g, "").trim();
  if (!cleanName) {
    return name[0] || "?";
  }
  const nameParts = cleanName.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0][0];

  return initials.toUpperCase();
}

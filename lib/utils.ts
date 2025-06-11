import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getColorFromChar = (char: string) => {
  const gradients: Record<string, string> = {
    A: "bg-gradient-to-br from-red-400 to-pink-500",
    B: "bg-gradient-to-br from-orange-400 to-yellow-500",
    C: "bg-gradient-to-br from-amber-400 to-lime-500",
    D: "bg-gradient-to-br from-yellow-400 to-emerald-500",
    E: "bg-gradient-to-br from-lime-400 to-teal-500",
    F: "bg-gradient-to-br from-green-400 to-cyan-500",
    G: "bg-gradient-to-br from-emerald-400 to-sky-500",
    H: "bg-gradient-to-br from-teal-400 to-blue-500",
    I: "bg-gradient-to-br from-cyan-400 to-indigo-500",
    J: "bg-gradient-to-br from-sky-400 to-purple-500",
    K: "bg-gradient-to-br from-blue-400 to-fuchsia-500",
    L: "bg-gradient-to-br from-indigo-400 to-pink-500",
    M: "bg-gradient-to-br from-violet-400 to-red-500",
    N: "bg-gradient-to-br from-purple-400 to-orange-500",
    O: "bg-gradient-to-br from-fuchsia-400 to-amber-500",
    P: "bg-gradient-to-br from-pink-400 to-lime-500",
    Q: "bg-gradient-to-br from-rose-400 to-cyan-500",
    R: "bg-gradient-to-br from-red-300 to-yellow-400",
    S: "bg-gradient-to-br from-orange-300 to-green-400",
    T: "bg-gradient-to-br from-yellow-300 to-blue-400",
    U: "bg-gradient-to-br from-lime-300 to-purple-400",
    V: "bg-gradient-to-br from-emerald-300 to-pink-400",
    W: "bg-gradient-to-br from-teal-300 to-rose-400",
    X: "bg-gradient-to-br from-cyan-300 to-orange-400",
    Y: "bg-gradient-to-br from-blue-300 to-fuchsia-400",
    Z: "bg-gradient-to-br from-indigo-300 to-lime-400",
  };

  const upperChar = char.toUpperCase();
  return gradients[upperChar] || "bg-gradient-to-br from-gray-400 to-gray-500";
};

export function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // fallback for older browsers
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    return Promise.resolve();
  }
}
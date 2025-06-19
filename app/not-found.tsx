"use client";
import React from "react";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-gray-400" />
        </div>

        {/* 404 Number */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

        {/* Main Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page may have
          been moved, deleted, or the URL may be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={"/"}
            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go to Homepage
          </Link>

          <button onClick={() => router.back()} className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Footer Text */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="#" className="text-gray-700 hover:text-gray-900 underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

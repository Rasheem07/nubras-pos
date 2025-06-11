// File: components/SalesTabContent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { TabsContent } from '@/components/ui/tabs';
import { copyToClipboard } from '@/lib/utils'; // optional helper if you want a “Copy Link” option
import { MessageCircle, Mail, Share2 } from 'lucide-react';

////////////////////////////////////////////////////////////////////////////////
// 1) Define your categories in an array
////////////////////////////////////////////////////////////////////////////////
type Category = {
  key: string;            // unique key
  title: string;          // card title
  description: string;    // subtitle/description
  path: string;           // where “Generate Report” points to
};

const categories: Category[] = [
  {
    key: 'kandora',
    title: 'Gents Kandora',
    description: 'Daily sales report for premium Gents Kandora section.',
    path: '/reports/kandora/daily',
  },
  {
    key: 'gents-items',
    title: 'Gents Items',
    description: 'Daily inventory and sales report for Gents Items.',
    path: '/reports/gents-items/daily',
  },
  {
    key: 'gents-jacket',
    title: 'Gents Jacket',
    description: 'Comprehensive daily summary for Gents Jacket sales.',
    path: '/reports/gents-jacket/daily',
  },
  {
    key: 'junior-section',
    title: 'Junior Section',
    description: 'Daily performance report for the Junior Section.',
    path: '/reports/junior-section/daily',
  },
];

////////////////////////////////////////////////////////////////////////////////
// 2) A small helper to build a full URL on the client
////////////////////////////////////////////////////////////////////////////////
function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState<string>('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);
  return baseUrl;
}

////////////////////////////////////////////////////////////////////////////////
// 3) Reusable ReportCard component
////////////////////////////////////////////////////////////////////////////////
interface ReportCardProps {
  category: Category;
  baseUrl: string;
}

function ReportCard({ category, baseUrl }: ReportCardProps) {
  const shareUrl = `${baseUrl}${category.path}`;

  return (
    <Card className="hover:shadow-lg transition-shadow border border-gray-200">
      <CardHeader>
        <CardTitle>{category.title}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col justify-between space-y-4">
        <p className="text-sm text-gray-600">
          {`Click “Generate Report” to view the ${category.title} daily analytics.`}
        </p>

        <div className="flex items-center justify-between">
          {/* Generate Report */}
          <Link href={category.path} passHref target='_blank' >
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Generate Report
            </Button>
          </Link>

          {/* Share Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 px-2 py-1"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs">Share</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2">
              <p className="mb-2 text-sm font-semibold">Share Link:</p>
              <div className="space-y-2">
                {/* WhatsApp */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        `${category.title} Report: ${shareUrl}`
                      )}`,
                      '_blank'
                    );
                  }}
                >
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">WhatsApp</span>
                </button>

                {/* Gmail */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => {
                    window.open(
                      `https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(
                        `${category.title} Daily Report`
                      )}&body=${encodeURIComponent(shareUrl)}`,
                      '_blank'
                    );
                  }}
                >
                  <Mail className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Gmail</span>
                </button>

                {/* Copy to Clipboard (optional) */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
                  onClick={() => {
                    copyToClipboard(shareUrl);
                    alert('Link copied to clipboard!');
                  }}
                >
                  <Share2 className="h-4 w-4 text-gray-700 rotate-45" />
                  <span className="text-sm">Copy Link</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

////////////////////////////////////////////////////////////////////////////////
// 4) Main “Sales” TabsContent
////////////////////////////////////////////////////////////////////////////////
export default function SalesTabContent() {
  const baseUrl = useBaseUrl();

  return (
    <TabsContent value="sales" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {categories.map((category) => (
          <ReportCard
            key={category.key}
            category={category}
            baseUrl={baseUrl}
          />
        ))}
      </div>
    </TabsContent>
  );
}

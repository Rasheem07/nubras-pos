import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TailoringOrdersTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="font-semibold text-gray-900">Order Details</TableHead>
          <TableHead className="font-semibold text-gray-900">Customer</TableHead>
          <TableHead className="font-semibold text-gray-900">Items Requiring Tailoring</TableHead>
          <TableHead className="font-semibold text-gray-900">Total Value</TableHead>
          <TableHead className="font-semibold text-gray-900">Priority</TableHead>
          <TableHead className="font-semibold text-gray-900">Status</TableHead>
          <TableHead className="font-semibold text-gray-900">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i} className="animate-pulse">
            <TableCell>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-8 w-20 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

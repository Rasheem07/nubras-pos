import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function SalesOrderLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-start mb-8 pb-6 border-b">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-6 w-32 ml-auto" />
            <Skeleton className="h-4 w-28 ml-auto" />
            <Skeleton className="h-4 w-28 ml-auto" />
            <Skeleton className="h-6 w-20 ml-auto" />
          </div>
        </div>

        <div className="mb-6">
          <Skeleton className="h-5 w-16 mb-3" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-5 w-12 mb-3" />
          <div className="space-y-3">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Skeleton className="h-24 w-80" />
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </Card>
    </div>
  )
}

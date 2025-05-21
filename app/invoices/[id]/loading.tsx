import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function InvoiceDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="mt-4 md:mt-0 md:text-right space-y-2">
            <Skeleton className="h-6 w-40 ml-auto" />
            <Skeleton className="h-4 w-32 ml-auto" />
            <Skeleton className="h-4 w-32 ml-auto" />
          </div>
        </div>

        <div className="mb-6">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <div className="space-y-2 text-right">
            <Skeleton className="h-5 w-32 ml-auto" />
            <Skeleton className="h-5 w-32 ml-auto" />
            <Skeleton className="h-6 w-40 ml-auto" />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-64 mt-4" />
        </div>
      </Card>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Skeleton className="h-10 w-full md:w-[400px]" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
        </div>
        <div className="rounded-md border">
          <div className="h-[500px] w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-5 w-40 mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

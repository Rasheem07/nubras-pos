import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex w-full flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-[350px]" />
            <Skeleton className="h-9 w-[150px]" />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-[80%]" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-6 w-[180px]" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-[75%]" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-7 w-7 rounded-full" />
                  <Skeleton className="h-6 w-[220px]" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-[85%]" />
              <div className="flex space-x-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

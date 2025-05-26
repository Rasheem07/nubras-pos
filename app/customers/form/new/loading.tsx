export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-96 bg-muted rounded-lg animate-pulse" />
          <div className="h-96 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}

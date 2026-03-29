import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditorLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between border-b bg-white px-4 py-2 -mx-6 -mt-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-6 w-px" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden mt-4 gap-4">
        <div className="w-48 shrink-0 space-y-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>

        <div className="flex-1 rounded-lg border bg-white p-6 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        <div className="w-72 shrink-0 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-16 mx-auto" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

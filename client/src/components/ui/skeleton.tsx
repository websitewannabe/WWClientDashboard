import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-800",
        className
      )}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="p-6">
        <Skeleton className="h-5 w-1/4 mb-4" />
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 p-6 border-b">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b last:border-0">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}

export function DataTableSkeleton({ rowCount = 5 }: { rowCount?: number }) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-slate-50 dark:bg-slate-800">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-1/4 mr-3" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rowCount }).map((_, i) => (
        <div key={i} className="flex items-center p-4 border-b">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-1/4 mr-3" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <div className="w-full" style={{ height }}>
      <div className="h-full w-full flex flex-col justify-between p-4 rounded-md border bg-slate-50 dark:bg-slate-800">
        <Skeleton className="h-5 w-1/4 mb-4" />
        <div className="flex-1 flex items-end">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full">
              <Skeleton 
                className={`w-3/4 mx-auto`} 
                style={{ 
                  height: `${Math.random() * 60 + 20}%`
                }} 
              />
              <Skeleton className="h-3 w-4 mx-auto mt-2" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-full mt-4" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm dark:bg-slate-950 dark:border-slate-800">
      <Skeleton className="h-4 w-2/3 mb-3" />
      <Skeleton className="h-8 w-1/2 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}

export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
        
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        
        {/* Main chart */}
        <ChartSkeleton height="400px" />
        
        {/* Secondary charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        
        {/* Data tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <DataTableSkeleton rowCount={5} />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <DataTableSkeleton rowCount={5} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function InvoicePageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-10 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <DataTableSkeleton rowCount={10} />
        
        <div className="mt-4 flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SupportPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      
      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const DepartmentGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-6 w-[60px] rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DepartmentGridSkeleton;

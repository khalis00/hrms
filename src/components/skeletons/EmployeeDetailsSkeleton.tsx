import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const EmployeeDetailsSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-[200px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-[150px] mb-4" />
            <div className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j}>
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-5 w-[180px]" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDetailsSkeleton;

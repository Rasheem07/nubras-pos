import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="py-20">
      <Loader2 className="animate-spin mx-auto h-6 w-6" />
    </div>
  );
}

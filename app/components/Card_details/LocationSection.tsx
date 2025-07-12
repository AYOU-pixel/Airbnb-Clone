import { MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Map from "./Map";

export default function LocationSection({ location }: { location: string }) {
  return (
    <div id="location" className="space-y-4 py-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Where you'll be</h2>

      <div className="flex items-start gap-2">
        <MapPin className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
        <p className="text-gray-600">{location}</p>
      </div>

      <div className="border border-gray-300 rounded-xl overflow-hidden h-64">
        <Map />
      </div>

      <Button
        variant="ghost"
        className="p-0 h-auto text-sm text-gray-900 underline hover:no-underline mt-1"
      >
        Show more <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
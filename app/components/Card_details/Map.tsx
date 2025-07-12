import { MapPin } from "lucide-react";

export default function Map() {
  return (
    <div className="relative h-full w-full bg-gradient-to-tr from-gray-200 via-gray-300 to-slate-200 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500 text-white shadow-md mb-2">
          <MapPin className="w-6 h-6" />
        </div>
        <p className="text-white font-medium text-sm drop-shadow-lg">
          Property Location
        </p>
      </div>
    </div>
  );
}

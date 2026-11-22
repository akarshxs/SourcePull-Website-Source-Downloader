import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col items-center justify-center p-6 selection:bg-[#da291c]">
      <div className="w-12 h-12 bg-[#202020] border border-[#da291c] flex items-center justify-center mb-6">
        <AlertCircle className="w-6 h-6 text-[#da291c]" />
      </div>
      <div className="font-mono text-xs text-[#da291c] tracking-[1.5px] uppercase mb-2">
        ERROR // 404 NOT FOUND
      </div>
      <h1 className="font-display font-medium text-4xl uppercase tracking-tight text-white mb-4">
        TARGET ROUTE NOT LOCATED
      </h1>
      <p className="text-[#969696] text-sm max-w-md text-center leading-relaxed mb-8">
        The requested endpoint or asset does not exist within the current crawling environment.
      </p>
      <Link href="/" className="btn-prime text-xs py-3 px-6">
        <ArrowLeft className="w-3.5 h-3.5 mr-2" />
        RETURN TO EXTRACTION CONSOLE
      </Link>
    </div>
  );
}

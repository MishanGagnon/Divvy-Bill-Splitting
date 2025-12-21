"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function JoinCodePage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const receiptId = useQuery(api.share.getReceiptByCode, { code });

  useEffect(() => {
    if (receiptId) {
      router.replace(`/receipts/${receiptId}`);
    }
  }, [receiptId, router]);

  if (receiptId === undefined) {
    return (
      <main className="min-h-screen py-12 px-4 flex justify-center bg-background">
        <div className="w-full max-w-lg receipt-paper jagged-top jagged-bottom p-8 flex flex-col items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <p className="text-sm uppercase font-bold tracking-widest opacity-50">
              Validating Code...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (receiptId === null) {
    return (
      <main className="min-h-screen py-12 px-4 flex justify-center bg-background">
        <div className="w-full max-w-lg receipt-paper jagged-top jagged-bottom p-8 flex flex-col items-center gap-8">
          <div className="text-center space-y-4 py-8">
            <h1 className="text-xl font-bold uppercase tracking-widest">
              Invalid or Expired Code
            </h1>
            <p className="text-xs uppercase opacity-60 leading-relaxed max-w-[250px] mx-auto">
              This share code is no longer active. Codes expire 30 minutes after generation.
            </p>
          </div>
          
          <div className="dotted-line"></div>
          
          <Link
            href="/"
            className="border-2 border-ink px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-all"
          >
            Return to Terminal
          </Link>
        </div>
      </main>
    );
  }

  return null;
}

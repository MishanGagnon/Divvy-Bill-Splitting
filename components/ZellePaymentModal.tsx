"use client";

import { toast } from "sonner";

interface ZellePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  zellePhone: string;
  amount: string;
  merchantName: string;
}

export function ZellePaymentModal({
  isOpen,
  onClose,
  zellePhone,
  amount,
  merchantName,
}: ZellePaymentModalProps) {
  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(zellePhone);
    toast.success("Zelle phone number copied!");
  };

  const handleCopyAmount = () => {
    // Remove currency symbol for easy pasting into payment apps
    const numericAmount = amount.replace(/[^0-9.]/g, "");
    navigator.clipboard.writeText(numericAmount);
    toast.success("Amount copied!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm receipt-paper jagged-top jagged-bottom p-8 flex flex-col gap-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs font-bold uppercase opacity-50 hover:opacity-100"
        >
          [ X ]
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 border-t border-ink/20 border-dashed"></div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap opacity-70">
              Pay via Zelle
            </h2>
            <div className="flex-1 border-t border-ink/20 border-dashed"></div>
          </div>
          <p className="text-xs uppercase opacity-60 leading-relaxed italic">
            Zelle doesn't support direct payment links. Please copy the details below to pay in your bank app.
          </p>
        </div>

        <div className="flex flex-col gap-4 py-2">
          {/* Phone Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest">
              Zelle Recipient (Phone)
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-paper border-2 border-ink px-4 py-3 text-lg font-bold uppercase tracking-widest truncate">
                {zellePhone}
              </div>
              <button
                onClick={handleCopyPhone}
                className="bg-ink text-paper px-4 flex items-center justify-center hover:opacity-90 transition-all active:translate-y-[1px]"
                title="Copy Phone Number"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest">
              Amount to Pay
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-paper border-2 border-ink px-4 py-3 text-lg font-bold uppercase tracking-widest">
                {amount}
              </div>
              <button
                onClick={handleCopyAmount}
                className="bg-ink text-paper px-4 flex items-center justify-center hover:opacity-90 transition-all active:translate-y-[1px]"
                title="Copy Amount"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="dotted-line"></div>

        <button
          onClick={onClose}
          className="w-full bg-ink text-paper py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-[4px_4px_0px_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          [ DONE ]
        </button>
        
        <p className="text-[9px] uppercase opacity-40 text-center font-bold tracking-tighter">
          Note: Payment for {merchantName}
        </p>
      </div>
    </div>
  );
}


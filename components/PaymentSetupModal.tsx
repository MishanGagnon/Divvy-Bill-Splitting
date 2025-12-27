"use client";

import { useRouter } from "next/navigation";

interface PaymentSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSetupModal({ isOpen, onClose }: PaymentSetupModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm receipt-paper jagged-top jagged-bottom p-8 flex flex-col gap-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs font-bold uppercase opacity-50 hover:opacity-100"
        >
          [ X ]
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 border-t border-ink/20 border-dashed"></div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-center whitespace-nowrap opacity-70">
              Setup Required
            </h2>
            <div className="flex-1 border-t border-ink/20 border-dashed"></div>
          </div>
          <p className="text-xs uppercase opacity-60 leading-relaxed">
            To start a split and receive payments, you need to set up at least one payment method (Venmo, Cash App, or Zelle) in your profile.
          </p>
        </div>

        <button
          onClick={() => {
            router.push("/profile?returnTo=/");
            onClose();
          }}
          className="w-full bg-ink text-paper py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md"
        >
          [ GO TO PROFILE SETUP ]
        </button>
        
        <button
          onClick={onClose}
          className="w-full text-[10px] font-bold uppercase underline opacity-50 hover:opacity-100 py-2"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}



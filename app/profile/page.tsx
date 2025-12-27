"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {
  const user = useQuery(api.receipt.currentUser);
  const updateUserProfile = useMutation(api.receipt.updateUserProfile);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [name, setName] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("");
  const [cashAppUsername, setCashAppUsername] = useState("");
  const [zellePhone, setZellePhone] = useState("");
  const [preferredMethod, setPreferredMethod] = useState<"venmo" | "cashapp" | "zelle">("venmo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (phone: string) => {
    // Basic phone validation: digits only or common symbols
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneRegex.test(phone);
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setVenmoUsername(user.venmoUsername || "");
      setCashAppUsername(user.cashAppUsername || "");
      setZellePhone(user.zellePhone || "");
      setPreferredMethod((user.preferredPaymentMethod as any) || "venmo");
    }
  }, [user]);

  if (user === undefined) {
    return (
      <main className="min-h-screen py-6 sm:py-12 px-2 sm:px-4 flex justify-center bg-background">
        <div className="w-full max-w-lg receipt-paper jagged-top jagged-bottom p-6 sm:p-8 flex flex-col items-center justify-center min-h-[400px]">
          <p className="animate-pulse text-sm uppercase font-bold">Loading Profile...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (zellePhone && !validatePhone(zellePhone)) {
      toast.error("Please enter a valid Zelle phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserProfile({
        name,
        venmoUsername: venmoUsername.trim().replace(/^@/, ""),
        cashAppUsername: cashAppUsername.trim().replace(/^\$/, ""),
        zellePhone: zellePhone.trim(),
        preferredPaymentMethod: preferredMethod,
      });
      toast.success("Profile updated successfully!");
      if (returnTo) {
        router.push(returnTo);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-6 sm:py-12 px-2 sm:px-4 flex justify-center bg-background">
      <div className="w-full max-w-lg receipt-paper jagged-top jagged-bottom p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full flex justify-between items-center">
            <Link
              href="/"
              className="text-[10px] font-bold uppercase underline opacity-50 hover:opacity-100 whitespace-nowrap"
            >
              [ BACK TO HOME ]
            </Link>
          </div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-center">
            User Profile
          </h1>
          <div className="dotted-line"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-paper border-2 border-ink px-4 py-3 text-base font-bold uppercase tracking-widest placeholder:opacity-30 focus:outline-none"
              />
            </div>

            <div className="dotted-line"></div>

            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-2">
              Payment Methods
            </h3>

            <div className="flex flex-col gap-4">
              {/* Venmo */}
              <div 
                className={`flex flex-col gap-2 p-4 border-2 transition-all cursor-pointer ${preferredMethod === "venmo" ? "border-ink bg-ink/5" : "border-ink/10 bg-transparent"}`}
                onClick={() => setPreferredMethod("venmo")}
              >
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest cursor-pointer">
                    Venmo Username
                  </label>
                  {preferredMethod === "venmo" && (
                    <span className="text-[8px] uppercase font-bold bg-ink text-paper px-2 py-0.5 tracking-tighter">Preferred</span>
                  )}
                </div>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 font-bold">@</span>
                  <input
                    type="text"
                    value={venmoUsername}
                    onChange={(e) => setVenmoUsername(e.target.value)}
                    placeholder="username"
                    className="w-full bg-paper border-2 border-ink pl-8 pr-4 py-3 text-base font-bold uppercase tracking-widest placeholder:opacity-30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cash App */}
              <div 
                className={`flex flex-col gap-2 p-4 border-2 transition-all cursor-pointer ${preferredMethod === "cashapp" ? "border-ink bg-ink/5" : "border-ink/10 bg-transparent"}`}
                onClick={() => setPreferredMethod("cashapp")}
              >
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest cursor-pointer">
                    Cash App ($Cashtag)
                  </label>
                  {preferredMethod === "cashapp" && (
                    <span className="text-[8px] uppercase font-bold bg-ink text-paper px-2 py-0.5 tracking-tighter">Preferred</span>
                  )}
                </div>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 font-bold">$</span>
                  <input
                    type="text"
                    value={cashAppUsername}
                    onChange={(e) => setCashAppUsername(e.target.value)}
                    placeholder="cashtag"
                    className="w-full bg-paper border-2 border-ink pl-8 pr-4 py-3 text-base font-bold uppercase tracking-widest placeholder:opacity-30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Zelle */}
              <div 
                className={`flex flex-col gap-2 p-4 border-2 transition-all cursor-pointer ${preferredMethod === "zelle" ? "border-ink bg-ink/5" : "border-ink/10 bg-transparent"}`}
                onClick={() => setPreferredMethod("zelle")}
              >
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold opacity-50 tracking-widest cursor-pointer">
                    Zelle (Phone Number)
                  </label>
                  {preferredMethod === "zelle" && (
                    <span className="text-[8px] uppercase font-bold bg-ink text-paper px-2 py-0.5 tracking-tighter">Preferred</span>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={zellePhone}
                    onChange={(e) => setZellePhone(e.target.value)}
                    placeholder="555-555-5555"
                    className="w-full bg-paper border-2 border-ink px-4 py-3 text-base font-bold uppercase tracking-widest placeholder:opacity-30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ink text-paper py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 shadow-[4px_4px_0px_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {isSubmitting ? "Saving..." : "[ Save Profile ]"}
          </button>
        </form>

        <div className="dotted-line"></div>
        <p className="text-[10px] uppercase opacity-50 italic text-center leading-relaxed">
          Ensure your payment handles are correct to receive payments from your friends.
        </p>
      </div>
    </main>
  );
}


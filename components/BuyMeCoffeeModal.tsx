import React from 'react';
import { UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onSupporterReward?: () => void;
}

const BuyMeCoffeeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      data-testid="buy-coffee-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto"
    >
      <div className="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-base">
              ☕
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Buy Me a Coffee · Support Code It Out
              </h3>
              <p className="text-[11px] text-slate-400">
                Scan with any UPI App &amp; pay any amount you wish
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
          >
            Close ✕
          </button>
        </div>

        {/* Official Razorpay BHIM UPI QR Card (User's Uploaded QR) */}
        <div className="w-full max-w-[290px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-white">
          <img
            src="/assets/aistudio/QrCode_9b4297d7.jpeg"
            alt="Razorpay BHIM UPI QR Code — Scan & Pay with Any UPI App (GPay, PhonePe, Paytm)"
            data-testid="razorpay-upi-qr-image"
            className="w-full h-auto block select-none -mt-16"
          />
        </div>

        {/* Direct Official Razorpay.me Handle Link (Exact URL — No Path Suffix) */}
        <div className="space-y-2 pt-1">
          <a
            href="https://razorpay.me/@codedaily"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="razorpay-me-link"
            className="w-full min-h-[42px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg whitespace-nowrap"
          >
            <span>☕</span>
            <span>Pay Any Amount Online (razorpay.me/@codedaily) ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BuyMeCoffeeModal;

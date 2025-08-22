"use client";
import { useState, useRef } from "react";

type Props = {
  otp: any;
  setOtp: (otp: any) => void;
};
const OtpInput = ({ otp, setOtp }: Props) => {
  const inputRefs = useRef<any>([]);

  const handleChange = (index: any, value: any) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: any, e: any) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

      // Focus on the last input after paste
      if (newOtp.length === 6) {
        inputRefs.current[5].focus();
      } else if (newOtp.length > 0) {
        inputRefs.current[newOtp.length].focus();
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-default-700">OTP Code</label>
      <div className="flex gap-2 justify-between">
        {otp.map((digit: any, index: any) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-12 text-center text-lg font-semibold border-2 border-default-300 rounded-lg focus:border-theme focus:outline-none transition-colors"
          />
        ))}
      </div>
    </div>
  );
};

export default OtpInput;

"use client";

import showToast from "@/lib/toast";
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";
import { ArrowLeft, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import OtpInput from "../OTPInput";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP, 3: New password
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Cooldown timer in seconds

  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const validatePhone = () => {
    if (!phone) {
      showToast("Error", "danger");
      setIsLoading(false);
      return false;
    } else if (!/^(?:\+88|01)?\d{11}$/.test(phone)) {
      showToast("Info", "warning", "Please provide a valid phone number");
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    return true;
  };

  const validateOtp = () => {
    if (!otp.join("")) {
      showToast("Error", "danger", "Please provide the otp");
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!newPassword) {
      showToast("Error", "danger");
    }

    if (!confirmPassword) {
      showToast("Error", "danger");
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (validatePhone()) {
      setIsLoading(true);
      const { data, error } = await authClient.phoneNumber.requestPasswordReset({
        phoneNumber: phone,
      });

      if (data?.status) {
        setStep(2);
        showToast("Success", "success", "Otp has been sent");
      } else {
        showToast("Error", "danger", error?.message);
      }
    }
    setIsLoading(false);
  };

  const handleResendOtp = () => {
    if (cooldown === 0) {
      handleSendOtp();
    }
  };

  const handleVerifyOtp = async () => {
    if (validateOtp()) {
      setStep(3);
    }
  };

  const handleResetPassword = async () => {
    if (validatePassword()) {
      setIsLoading(true);

      const { data, error } = await authClient.phoneNumber.resetPassword({
        phoneNumber: phone,
        otp: otp.join(""),
        newPassword,
      });
      console.log(data, error);

      if (data?.status) {
        setStep(3);
        showToast("Success", "success", "Password reset success");
        router.back();
      } else {
        showToast("Error", "danger", error?.message);
      }
      setIsLoading(false);
    }
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <section className="flex items-center justify-center w-full min-h-screen p-4">
        <Card className="p-5  shadow-xl w-full max-w-md">
          <CardHeader className="flex-col items-start gap-2 pb-4">
            <h2 className="text-xl md:text-2xl font-bold ">Change the password</h2>
            <div className="text-sm md:text-base ">
              {step === 1 && "Enter your mobile number below, an OTP code will be sent."}
              {step === 2 && `Enter the OTP code sent to ${phone}.`}
              {step === 3 && "Set your new password."}
            </div>
          </CardHeader>

          <CardBody className="gap-4">
            {step === 1 && (
              <>
                <Input
                  label="Phone Number"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  type="tel"
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    inputWrapper: "border-default-300",
                    mainWrapper: "w-full",
                  }}
                  radius="sm"
                  startContent="+88"
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendOtp();
                    }
                  }}
                  className="w-full"
                />
                <Button
                  color="primary"
                  className="w-full bg-theme"
                  radius="sm"
                  onPress={handleSendOtp}
                  isLoading={isLoading}
                >
                  Get OTP
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <Button
                  className="text-sm text-theme bg-transparent items-start justify-baseline hover:underline text-start cursor-pointer !p-0"
                  onPress={() => setStep(1)}
                  startContent={<ArrowLeft />}
                >
                  Change the phone number
                </Button>

                <OtpInput otp={otp} setOtp={setOtp} />

                <div className="text-sm  flex flex-col gap-2">
                  {cooldown > 0 ? (
                    <div className="flex items-center gap-1">
                      <span>You can get a new OTP after</span>
                      <span className="font-medium text-theme">{formatTime(cooldown)}</span>
                      <span> second</span>
                    </div>
                  ) : (
                    <div>
                      OTP not send yet?{" "}
                      <button
                        className="text-theme hover:underline cursor-pointer"
                        onClick={handleResendOtp}
                        disabled={cooldown > 0 || isLoading}
                      >
                        Resent OTP
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  color="primary"
                  className="w-full font-medium bg-theme"
                  onPress={handleVerifyOtp}
                  radius="sm"
                  isLoading={isLoading}
                >
                  Verify OTP
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <Button
                  className="text-sm text-theme bg-transparent items-start justify-baseline hover:underline text-start cursor-pointer !p-0"
                  onPress={() => {
                    setStep(2);
                  }}
                  startContent={<ArrowLeft />}
                >
                  Change the OTP
                </Button>
                <Input
                  classNames={{
                    inputWrapper: "border-default-300",
                    mainWrapper: "w-full",
                  }}
                  variant="bordered"
                  labelPlacement="outside"
                  radius="sm"
                  label="New Password"
                  type="password"
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                  startContent={<Lock />}
                />

                <Input
                  classNames={{
                    inputWrapper: "border-default-300",
                    mainWrapper: "w-full",
                  }}
                  variant="bordered"
                  labelPlacement="outside"
                  radius="sm"
                  label="Confirm New Password"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  startContent={<Lock />}
                />

                <Button
                  radius="sm"
                  className="w-full font-medium bg-theme"
                  onPress={handleResetPassword}
                  isLoading={isLoading}
                >
                  Change the password
                </Button>
              </>
            )}
          </CardBody>
        </Card>
      </section>
    </>
  );
};

export default ForgetPassword;

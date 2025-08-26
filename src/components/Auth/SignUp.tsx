"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Form, Input, Textarea } from "@heroui/react";

import showToast from "@/lib/toast";
import { cn, formatTime } from "@/lib/utils";
import Image from "next/image";
import OtpInput from "../OTPInput";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { otpVerify } from "@/actions";

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useQueryState("step", {
    defaultValue: "1",
    clearOnDefault: true,
  }); // 1: Signup, 2: Enter OTP
  const [phone, setPhone] = useQueryState("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [cooldown, setCooldown] = useState(0); // Cooldown timer in seconds

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");
    const phone = formData.get("phone");

    if (password !== confirmPassword) {
      showToast("Error", "danger", "Password doesn't matched!");
      setLoading(false);
      return;
    }
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_V1}/user/create?role=student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }).then((res) => res.json());

      if (res.success) {
        showToast("Success", "success", res.message);
        setStep("2");

        setPhone(phone as string);
        setCooldown(120);
        const interval = setInterval(() => {
          setCooldown((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast("Error", "danger", res.message);
      }
    } catch (error) {
      console.log(error);

      showToast("Error", "danger", "Something went wrong");
    }

    setLoading(false);
  };

  const handleResendOtp = () => {
    setLoading(true);
    if (cooldown === 0) {
      setCooldown(120);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    }
    setLoading(false);
  };
  const handleVerifyOtp = async () => {
    setLoading(true);
    if (otp.join("").length > 0) {
      const res = await otpVerify(JSON.stringify({ otp: otp.join(""), phone }));
      console.log(res);

      if (res.success) {
        showToast("Success", "success", res.message);
        useUserStore.getState().setUser(res.user);
        setLoading(false);
        router.push("/");
      } else {
        showToast("Error", "danger", res.message);
        setLoading(false);
        return;
      }
    } else {
      showToast("Error", "danger", "OTP doesn't matched!");
      setLoading(false);
      return;
    }
    setLoading(false);
  };
  return (
    <>
      <section className="flex items-center justify-center w-full min-h-screen my-20 md:p-0 px-2.5">
        {step === "1" && (
          <Form onSubmit={handleSubmit}>
            <Card className="p-5 bg-blend-darken bg-transparent sm:min-w-lg">
              <CardHeader className="flex-col">
                <h2 className="text-lg md:text-xl mb-1">Sign Up</h2>
                <div className="text-xs md:text-sm text-center">
                  Already have an account?{" "}
                  <Link href={"/auth/login"} className="text-theme underline hover:text-theme/80">
                    Login
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid gap-5">
                  <Input
                    classNames={{
                      inputWrapper: "border-default-300",
                      mainWrapper: "w-full",
                    }}
                    variant="bordered"
                    labelPlacement="outside"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    label="Enter your name"
                    isRequired
                    radius="sm"
                  />{" "}
                  <Input
                    classNames={{
                      inputWrapper: "border-default-300",
                      mainWrapper: "w-full",
                    }}
                    variant="bordered"
                    labelPlacement="outside"
                    id="phone"
                    name="phone"
                    label="Enter your phone number"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    startContent={"+88"}
                    isRequired
                    radius="sm"
                  />
                  <Input
                    classNames={{
                      inputWrapper: "border-default-300",
                      mainWrapper: "w-full",
                    }}
                    variant="bordered"
                    labelPlacement="outside"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    label="Enter your email"
                    radius="sm"
                  />
                  <Input
                    classNames={{
                      inputWrapper: "border-default-300",
                      mainWrapper: "w-full",
                    }}
                    variant="bordered"
                    labelPlacement="outside"
                    id="password"
                    name="password"
                    label="Enter your password"
                    placeholder="password"
                    autoComplete="password"
                    radius="sm"
                    isRequired
                    type={!showPassword ? "password" : "text"}
                    endContent={
                      !showPassword ? (
                        <Eye className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                      ) : (
                        <EyeClosed className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                      )
                    }
                  />
                  <Input
                    classNames={{
                      inputWrapper: "border-default-300",
                      mainWrapper: "w-full",
                    }}
                    variant="bordered"
                    labelPlacement="outside"
                    id="confirm_password"
                    name="confirm_password"
                    label="Enter your confirm password"
                    placeholder="confirm password"
                    autoComplete="confirm_password"
                    radius="sm"
                    isRequired
                    type={!showConfirmPassword ? "password" : "text"}
                    endContent={
                      !showConfirmPassword ? (
                        <Eye className="cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                      ) : (
                        <EyeClosed
                          className="cursor-pointer"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      )
                    }
                  />
                  <Button type="submit" className="w-full bg-theme hover:bg-theme-hover" isLoading={loading}>
                    Sign up
                  </Button>
                  <div className="relative w-full flex items-center justify-center my-5">
                    <span className="absolute opacity-80 ">or,</span>
                    <Divider />
                  </div>
                  <div className={cn("w-full gap-5 flex items-center", "justify-between flex-col")}>
                    <Button className={cn("w-full gap-2")} disabled={loading} onPress={async () => {}}>
                      <Image alt="google" src={"/google.svg"} width={200} height={200} className="size-5" />
                      Sign up with Google
                    </Button>

                    <Button className={cn("w-full gap-2")} disabled={loading} onPress={async () => {}}>
                      <Image alt="fb" src={"/facebook.svg"} width={200} height={200} className="size-5" />
                      Sign up with Facebook
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
        )}

        {step === "2" && (
          <>
            <Card className="p-5  shadow-xl w-full max-w-md">
              <CardHeader className="flex-col items-start gap-2 pb-4">
                <h2 className="text-xl md:text-2xl font-bold ">Change the password</h2>
                <div className="text-sm md:text-base ">{step === "2" && `Enter the OTP code sent to ${phone}.`}</div>
              </CardHeader>

              <CardBody className="gap-4">
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
                        disabled={cooldown > 0 || loading}
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
                  isLoading={loading}
                >
                  Verify OTP
                </Button>
              </CardBody>
            </Card>
          </>
        )}
      </section>
    </>
  );
}

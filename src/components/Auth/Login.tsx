"use client";

import { useState } from "react";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Input } from "@heroui/react";

import showToast from "@/lib/toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/actions";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedUrl = searchParams.get("redirect");

  const handleSubmitButtonClick = async () => {
    setLoading(true);
    const res = await login(JSON.stringify({ phoneNumber, password }));
    if (res.success) {
      showToast("Success", "success", res.message);
      useUserStore.getState().setUser(res.user);
      setLoading(false);
      if (redirectedUrl) router.push(redirectedUrl);
      else router.push("/");
    } else {
      showToast("Error", "danger", res.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <>
      <section className="flex items-center justify-center w-full min-h-screen py-20 md:p-0 px-2.5">
        <Card className="p-5 bg-blend-darken bg-transparent sm:min-w-md">
          <CardHeader className="flex-col">
            <h2 className="text-lg md:text-xl mb-2">Welcome back learners</h2>
            <div className="text-xs md:text-sm">
              New here?{" "}
              <Link href={"/auth/signup"} className="text-theme underline hover:text-theme/80">
                Create account.
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
                id="phone"
                type="tel"
                label="Phone Number"
                labelPlacement="outside"
                placeholder="01..."
                required
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                radius="sm"
                value={phoneNumber}
              />

              <Input
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                variant="bordered"
                id="password"
                placeholder="password"
                label="Password"
                labelPlacement="outside"
                autoComplete="password"
                radius="sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={!showPassword ? "password" : "text"}
                endContent={
                  !showPassword ? (
                    <Eye className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                  ) : (
                    <EyeClosed className="cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                  )
                }
              />
              <div className="mr-auto inline-block text-sm ">
                Forgot your password?{" "}
                <Link href="/auth/forget-password" className="text-theme underline hover:text-theme/80">
                  Click here
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  onChange={() => {
                    setRememberMe(!rememberMe);
                  }}
                  color="warning"
                >
                  Remember me
                </Checkbox>
              </div>

              <Button
                type="submit"
                className="w-full bg-theme hover:bg-theme-hover"
                isLoading={loading}
                radius="sm"
                onPress={handleSubmitButtonClick}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <p> Login </p>}
              </Button>

              <div className="relative w-full flex items-center justify-center my-5">
                <span className="absolute opacity-80 ">or,</span>
                <Divider />
              </div>

              <div className={cn("w-full gap-5 flex items-center", "justify-between flex-col")}>
                <Button className={cn("w-full gap-2")} disabled={loading} onPress={async () => {}}>
                  <Image alt="google" src={"/google.svg"} width={200} height={200} className="size-5" />
                  Sign in with Google
                </Button>

                <Button className={cn("w-full gap-2")} disabled={loading} onPress={async () => {}}>
                  <Image alt="fb" src={"/facebook.svg"} width={200} height={200} className="size-5" />
                  Sign in with Facebook
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Checkbox, Input } from "@heroui/react";

import showToast from "@/lib/toast";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmitButtonClick = async () => {};

  return (
    <>
      <section className="flex items-center justify-center w-full min-h-screen">
        <Card className="p-5 bg-dark-1">
          <CardHeader className="flex-col">
            <h2 className="text-lg md:text-xl">Sign In</h2>
            <div className="text-xs md:text-sm">Enter your email below to login to your account</div>
            <Link href={"/auth/signup"}>Sign Up</Link>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email">ফোন নম্বর</label>
                <Input
                  classNames={{
                    inputWrapper: "border-default-300",
                    mainWrapper: "w-full",
                  }}
                  variant="bordered"
                  id="phone"
                  type="tel"
                  placeholder="০১..."
                  required
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  radius="sm"
                  value={phoneNumber}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <label htmlFor="password">Password</label>
                  <Link href="/auth/forget-password" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>

                <Input
                  classNames={{
                    inputWrapper: "border-default-300",
                    mainWrapper: "w-full",
                  }}
                  variant="bordered"
                  id="password"
                  type="password"
                  placeholder="password"
                  autoComplete="password"
                  radius="sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  onChange={() => {
                    setRememberMe(!rememberMe);
                  }}
                >
                  Remember me
                </Checkbox>
              </div>

              <Button
                type="submit"
                className="w-full bg-theme hover:bg-theme-hover"
                isLoading={loading}
                onPress={handleSubmitButtonClick}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <p> Login </p>}
              </Button>

              {/* <div className={cn("w-full gap-2 flex items-center", "justify-between flex-col")}>
                <Button
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onPress={async () => {
                    await signIn.social(
                      {
                        provider: "google",
                        callbackURL: "/dashboard",
                      },
                      {
                        onRequest: (ctx) => {
                          setLoading(true);
                        },
                        onResponse: (ctx) => {
                          setLoading(false);
                        },
                      }
                    );
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                    <path
                      fill="#4285F4"
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                    ></path>
                    <path
                      fill="#EB4335"
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    ></path>
                  </svg>
                  Sign in with Google
                </Button>
                <Button
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onPress={async () => {
                    await signIn.social(
                      {
                        provider: "tiktok",
                        callbackURL: "/dashboard",
                      },
                      {
                        onRequest: (ctx) => {
                          setLoading(true);
                        },
                        onResponse: (ctx) => {
                          setLoading(false);
                        },
                      }
                    );
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.88em" height="1em" viewBox="0 0 448 512">
                    <path
                      fill="currentColor"
                      d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"
                    />
                  </svg>
                  Sign in with Tiktok
                </Button>
                <Button
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onPress={async () => {
                    await signIn.social(
                      {
                        provider: "facebook",
                        callbackURL: "/dashboard",
                      },
                      {
                        onRequest: (ctx) => {
                          setLoading(true);
                        },
                        onResponse: (ctx) => {
                          setLoading(false);
                        },
                      }
                    );
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                      d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Sign in with Facebook
                </Button>
              </div> */}
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
}

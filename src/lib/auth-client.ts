import { phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [phoneNumberClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

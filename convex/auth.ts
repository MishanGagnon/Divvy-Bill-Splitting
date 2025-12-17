import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password,
    GitHub,
    Google({
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      profile(profile) {
        // Normalize fields so Convex identity has something useful
        return {
          id: profile.sub, // stable Google subject
          name: profile.name ?? profile.email ?? null,
          email: profile.email ?? null,
          image: (profile as any).picture ?? null,
        };
      },
    }),
  ],
});

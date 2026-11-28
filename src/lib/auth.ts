import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";
import { createAccessControl } from "better-auth/plugins/access";
import { prisma } from "./prisma";

const ac = createAccessControl({
  article: ["create", "update", "delete"],
  user: ["read"],
});

const roles = {
  ADMIN: ac.newRole({
    article: ["create", "update", "delete"],
    user: ["read"],
  }),
  USER: ac.newRole({
    user: ["read"],
  }),
} as const;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
      ac,
      roles,
    }),
  ],
});

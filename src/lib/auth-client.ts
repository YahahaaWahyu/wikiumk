import { createAuthClient } from "better-auth/react";

// baseURL tidak perlu: klien dan server satu origin.
export const authClient = createAuthClient();

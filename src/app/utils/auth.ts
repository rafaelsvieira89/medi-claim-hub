import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import  prisma  from "./db"
import Resend from "@auth/core/providers/resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Resend({
        from: "portal@suporte.iforyou.com.br",
    })],
})
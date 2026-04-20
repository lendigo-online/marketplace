import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import { rateLimit } from "@/lib/rateLimit"

function extractIp(req: any): string {
    const h = req?.headers || {}
    const forwarded = h["x-forwarded-for"]
    if (typeof forwarded === "string") return forwarded.split(",")[0].trim()
    const real = h["x-real-ip"]
    if (typeof real === "string") return real.trim()
    return "unknown"
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                const email = credentials.email.toLowerCase().trim()
                const ip = extractIp(req)

                const ipLimit = await rateLimit({ key: `login:ip:${ip}`, limit: 20, windowSeconds: 900 })
                if (!ipLimit.ok) {
                    throw new Error("Too many attempts. Try again later.")
                }

                const emailLimit = await rateLimit({ key: `login:email:${email}`, limit: 10, windowSeconds: 900 })
                if (!emailLimit.ok) {
                    throw new Error("Too many attempts. Try again later.")
                }

                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user || !user?.hashedPassword) {
                    throw new Error("Invalid credentials")
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials")
                }

                return { ...user, role: user.role }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.email = token.email as string
                session.user.name = token.name as string
                ;(session.user as any).id = token.id as string
                ;(session.user as any).role = token.role as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}

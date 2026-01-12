import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async signIn({ user }) {
            // Server-side email restriction - CRITICAL SECURITY CHECK
            const adminEmail = process.env.ADMIN_EMAIL;

            if (!adminEmail) {
                console.error('ADMIN_EMAIL not configured');
                return false;
            }

            // Only allow the predefined admin email
            if (user.email?.toLowerCase() === adminEmail.toLowerCase()) {
                return true;
            }

            // Block all other emails
            console.log(`Access denied for: ${user.email}`);
            return false;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = 'admin';
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

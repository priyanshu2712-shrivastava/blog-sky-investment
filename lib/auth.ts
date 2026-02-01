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
        async signIn() {
            // Allow all users to sign in via Google
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const adminEmail = process.env.ADMIN_EMAIL;
                // Assign role based on email - admin for matching email, user for others
                token.role = user.email?.toLowerCase() === adminEmail?.toLowerCase() ? 'admin' : 'user';
                token.email = user.email;
                token.picture = user.image;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                (session.user as { role?: string; email?: string }).role = token.role as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

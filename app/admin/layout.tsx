import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    // Defense in depth: verify user has admin role
    if ((session.user as { role?: string })?.role !== 'admin') {
        redirect('/login?error=AccessDenied');
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">

            {children}
        </div>
    );
}

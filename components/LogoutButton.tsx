'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    const handleLogout = () => {
        signOut({ callbackUrl: '/login' });
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
        >
            Sign out
        </button>
    );
}

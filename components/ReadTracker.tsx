'use client';

import { useEffect, useRef } from 'react';

interface ReadTrackerProps {
    slug: string;
}

export default function ReadTracker({ slug }: ReadTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Only track once per page load to avoid duplicate counts
        if (hasTracked.current) return;
        hasTracked.current = true;

        // Track the read after a small delay to ensure it's a real visit
        const trackRead = async () => {
            try {
                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ slug, type: 'read' }),
                });
            } catch (error) {
                console.error('Failed to track read:', error);
            }
        };

        // Delay the tracking slightly to filter out immediate bounces
        const timeoutId = setTimeout(trackRead, 1000);

        return () => clearTimeout(timeoutId);
    }, [slug]);

    // This component doesn't render anything visible
    return null;
}

'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
    slug: string;
}

export default function ReadingProgress({ slug }: ReadingProgressProps) {
    const [progress, setProgress] = useState(0);
    const [hasRead, setHasRead] = useState(false);

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;

            if (scrollHeight) {
                const percent = Number((currentProgress / scrollHeight).toFixed(2)) * 100;
                setProgress(percent);

                // Track Read when progress > 90%
                if (percent > 90 && !hasRead) {
                    setHasRead(true);
                    fetch('/api/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slug, type: 'read' }),
                    }).catch(console.error);
                }
            }
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, [slug, hasRead]);

    return (
        <div
            style={{ width: `${progress}%` }}
            className="fixed top-0 left-0 h-1 bg-red-600 z-50 transition-all duration-150 ease-out"
        />
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface HeroVideoProps {
    staticImageSrc: string;
    staticImageAlt: string;
}

export default function HeroVideo({ staticImageSrc, staticImageAlt }: HeroVideoProps) {
    const [videoState, setVideoState] = useState<'loading' | 'playing' | 'ended' | 'skipped'>('loading');
    const [isClient, setIsClient] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsClient(true);

        // Check reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Check local storage so we only play it once per visitor
        const hasPlayed = localStorage.getItem('heroVideoPlayed') === 'true';

        if (prefersReducedMotion || hasPlayed) {
            setVideoState('skipped');
            return;
        }

        // 1-second delay before playing
        const timer = setTimeout(() => {
            setVideoState('playing');
            if (videoRef.current) {
                videoRef.current.play().catch((err) => {
                    console.error("Video autoplay failed", err);
                    setVideoState('skipped'); // Fallback to static if autoplay fails
                });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleVideoEnded = () => {
        setVideoState('ended');
        localStorage.setItem('heroVideoPlayed', 'true');
    };

    if (!isClient) {
        return <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--color-cream-light)' }} />;
    }

    // If returning visitor, render static image instantly instead of video stream
    if (videoState === 'skipped') {
        return (
            <Image
                src={staticImageSrc}
                alt={staticImageAlt}
                width={1000}
                height={1000}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                priority
            />
        );
    }

    // Still playing or reached the end (it holds the last frame automatically)
    return (
        <video
            ref={videoRef}
            muted
            playsInline
            onEnded={handleVideoEnded}
            style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                display: 'block'
            }}
        >
            <source src="/videos/Luxury_Dry_Fruits_Commercial_Video_Generation.mp4" type="video/mp4" />
        </video>
    );
}

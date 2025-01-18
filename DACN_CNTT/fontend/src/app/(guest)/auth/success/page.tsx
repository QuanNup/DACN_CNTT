'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Loader from '@/components/ui/Loader';

export default function AuthSuccess() {
    const router = useRouter();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const access_token = query.get('access_token');
        const refresh_token = query.get('refresh_token');
        const name = query.get('name');
        const email = query.get('email');
        const image = query.get('image');
        const role = query.get('roles');
        if (access_token) {
            signIn('OAuthCallback', {
                access_token,
                refresh_token,
                name,
                email,
                image,
                role,
                redirect: false,
            }).then(() => {
                router.push('/'); // Chuyển hướng về trang chủ
            });
        }
    }, [router]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center">
                <Loader />
            </div>
        </div>
    )
}

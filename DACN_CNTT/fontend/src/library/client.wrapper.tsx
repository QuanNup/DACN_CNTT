'use client'
import Loader from '@/components/ui/Loader';
import React, { useEffect, useState } from 'react';


const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? <Loader /> : children}
        </>
    );
};

export default ClientWrapper;
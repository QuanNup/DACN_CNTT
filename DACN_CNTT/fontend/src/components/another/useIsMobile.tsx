'use client'
import { useEffect, useState } from "react";

export const UseIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);

        handleResize(); // Kiểm tra ngay khi component mount
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isMobile;
};
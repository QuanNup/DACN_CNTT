'use client';
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AppSideBarUser() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const menuItems = [
        { key: '1', label: 'Trang chủ', href: '/' },
        { key: '2', label: 'Danh mục sản phẩm', href: '/categories' },
        { key: '3', label: 'Lịch sử mua hàng', href: '/history' },
        { key: '4', label: 'Yêu thích', href: '/favorites' },
        { key: '5', label: 'Hỗ trợ', href: '/support' },
    ];

    const [isTabletView, setIsTabletView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsTabletView(window.innerWidth <= 1250); // Kích thước nhỏ hơn hoặc bằng iPad
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Kiểm tra ngay khi component mount

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div
            style={{
                height: 'auto',
                width: '100%',
                padding: '16px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '16px' }}>
                    {menuItems.map((item) => (
                        <li
                            key={item.key}
                            style={{
                                display: 'inline-block',
                                padding: '12px 24px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                background: hoveredKey === item.key ? (isDark ? "#3a3a3a" : "#ececec") : "",
                                transition: 'background 0.3s',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                            }}
                            onMouseEnter={() => setHoveredKey(item.key)}
                            onMouseLeave={() => setHoveredKey(null)}
                        >
                            <Link
                                href={item.href}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

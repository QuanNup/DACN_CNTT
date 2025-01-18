"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Store, Bell, Shield, CreditCard, Lock, Plug, Globe, Palette, HelpCircle } from 'lucide-react'
import { Button, Card, cn } from "@nextui-org/react"

const sidebarItems = [
    {
        title: "Cài đặt chung", // Tiêu đề nhóm
        items: [
            { name: "Thông tin chung", href: "/settings", icon: <User className="h-5 w-5" /> },
            { name: "Cửa hàng", href: "/settings/store", icon: <Store className="h-5 w-5" /> },
            { name: "Thông báo", href: "/settings/notifications", icon: <Bell className="h-5 w-5" /> },
        ],
    },
    {
        title: "Tài khoản", // Tiêu đề nhóm
        items: [
            { name: "Bảo mật", href: "/settings/security", icon: <Shield className="h-5 w-5" /> },
            { name: "Thanh toán", href: "/settings/billing", icon: <CreditCard className="h-5 w-5" /> },
            { name: "Quyền riêng tư", href: "/settings/privacy", icon: <Lock className="h-5 w-5" /> },
        ],
    },
    {
        title: "Cài đặt nâng cao", // Tiêu đề nhóm
        items: [
            { name: "Tích hợp", href: "/settings/integrations", icon: <Plug className="h-5 w-5" /> },
            { name: "Ngôn ngữ", href: "/settings/language", icon: <Globe className="h-5 w-5" /> },
            { name: "Giao diện", href: "/settings/appearance", icon: <Palette className="h-5 w-5" /> },
        ],
    },
    {
        title: "Hỗ trợ", // Tiêu đề nhóm
        items: [
            { name: "Trợ giúp & Hỗ trợ", href: "/settings/help", icon: <HelpCircle className="h-5 w-5" /> },
        ],
    },
];

export function SettingsSidebar() {
    const pathname = usePathname()

    return (
        <Card isBlurred className="p-4 ">
            <nav className="w-64 space-y-2">
                {sidebarItems.map((section, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-sm font-semibold uppercase mb-2 text-gray-500 dark:text-[#6272a4]">
                            {section.title}
                        </h3>
                        {section.items.map((item, subIndex) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={subIndex}
                                    href={item.href}
                                    className={`flex mb-1 items-center space-x-3 p-2 rounded-md transition-colors ${isActive
                                        ? " bg-gradient-to-br from-white to-gray-400  shadow-lg dark:bg-[#44475a] text-black dark:text-[#bd93f9] dark:bg-none"
                                        : "hover:bg-gradient-to-br hover:from-white hover:to-gray-300 dark:hover:bg-[#44475a] text-gray-700 dark:text-[#f8f8f2] dark:hover:bg-none"
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            )
                        }
                        )}
                    </div>
                ))}
            </nav>
        </Card>

    )
}


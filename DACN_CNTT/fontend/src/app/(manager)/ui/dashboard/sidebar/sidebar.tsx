'use client'
import { ThemeSwitch } from "@/components/another/theme-switch";
import { Card } from "@nextui-org/card";
import {
    BarChart2,
    DollarSign,
    HelpCircle,
    Home,
    Package,
    PieChart,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { MdAnalytics, MdAttachMoney, MdDashboard, MdHelpCenter, MdOutlineSettings, MdPeople, MdShoppingBag, MdSupervisedUserCircle, MdWork } from "react-icons/md";

interface MenuItem {
    icon: ReactNode;
    label: string;
    href: string;
}

const menuItems = [
    {
        title: "Trang",
        list: [
            {
                title: "Bảng điều khiển",
                path: "/dashboard",
                icon: <Home className="h-5 w-5" />,
            },
            {
                title: "Người dùng",
                path: "/dashboard/users",
                icon: <Users className="h-5 w-5" />,
            },
            {
                title: "Sản phẩm",
                path: "/dashboard/products",
                icon: <Package className="h-5 w-5" />,
            },
            {
                title: "Giao dịch",
                path: "/dashboard/transactions",
                icon: <DollarSign className="h-5 w-5" />,
            },
        ],
    },
    {
        title: "Phân tích",
        list: [
            {
                title: "Doanh thu",
                path: "/dashboard/revenue",
                icon: <BarChart2 className="h-5 w-5" />,
            },
            {
                title: "Báo cáo",
                path: "/dashboard/reports",
                icon: <PieChart className="h-5 w-5" />,
            },
            {
                title: "Nhóm",
                path: "/dashboard/teams",
                icon: <MdPeople className="h-5 w-5" />,
            },
        ],
    },
    {
        title: "Người dùng",
        list: [
            {
                title: "Cài đặt",
                path: "/dashboard/settings",
                icon: <Settings className="h-5 w-5" />,
            },
            {
                title: "Hỗ trợ",
                path: "/dashboard/support",
                icon: <HelpCircle className="h-5 w-5" />,
            },
        ],
    },
];

export default function SideBar() {
    const { data: session, status } = useSession();
    const currentPath = usePathname();
    return (
        <Card className="h-full w-full shadow-md bg-gradient-to-bl from-white to-gray-500 dark:bg-[#282a36] dark:bg-none">
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center space-x-2 dark:border-[#44475a]">
                <MdDashboard className="h-6 w-6 text-gray-500 dark:text-[#bd93f9]" />
                <span className="font-bold text-lg text-gray-900 dark:text-[#f8f8f2]">Quản lý cửa hàng</span>
                <div className="absolute top-4 right-4">
                    <ThemeSwitch />
                </div>
            </div>
            <div className="border-b px-6 py-4 flex items-center space-x-4 dark:border-[#44475a]">
                <Image
                    src="/logo.png"
                    alt="User Avatar"
                    className="rounded-full"
                    width="50"
                    height="50"
                />
                <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-[#f8f8f2]">{session?.user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#6272a4]">Quản trị viên</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="p-4">
                {menuItems.map((section, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-sm font-semibold uppercase mb-2 text-gray-500 dark:text-[#6272a4]">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.list.map((item, subIndex) => {
                                const isActive = currentPath === item.path;
                                return (
                                    <Link
                                        key={subIndex}
                                        href={item.path}
                                        className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${isActive
                                            ? " bg-gradient-to-br from-white to-gray-400  shadow-lg dark:bg-[#44475a] text-black dark:text-[#bd93f9] dark:bg-none"
                                            : "hover:bg-gradient-to-br hover:from-white hover:to-gray-300 dark:hover:bg-[#44475a] text-gray-700 dark:text-[#f8f8f2] dark:hover:bg-none"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="text-sm font-medium">
                                            {item.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>
        </Card>
    );
}

import AppHeaderUser from "@/components/layout/user/app.header.user";
import { CartProvider } from "../context/CartContext";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <CartProvider>
                <AppHeaderUser />
                <main
                    className="px-2 h-full"
                >
                    {children}
                </main>
            </CartProvider>
        </SessionProvider>
    )
}

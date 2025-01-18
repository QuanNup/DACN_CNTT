import AppHeaderUser from "@/components/layout/user/app.header.user";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { SettingsSidebar } from "./ui/setting_sidebar";
import Footer from "@/components/layout/user/app.footer.user";
import { Card } from "@nextui-org/card";

export default async function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8 h-auto">
                    <SettingsSidebar />
                    <main className="flex-1 space-y-6">
                        <Card isBlurred className="p-10 min-h-[65vh] h-auto">
                            {children}
                        </Card>
                    </main>
                </div>
            </div>
        </>
    )
}

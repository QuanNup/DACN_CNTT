import React, { ReactNode } from "react";
import { Card } from "@nextui-org/card";
import SideBar from "../ui/dashboard_admin/sidebar/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Global",
};
// Khai báo kiểu cho props
interface LayoutProps {
    children: ReactNode; // Định nghĩa kiểu cho children
}

const ManagerLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            {/* <div className="flex h-screen overflow-hidden">
        <SideBar />
      </div> */}
            <div
                className="grid h-screen w-full overflow-hidden layout-container-manager"
            >
                {/* Sidebar */}
                <aside
                    className="p-2 "
                    style={{ gridArea: "sidebar", }}
                >
                    <SideBar />
                </aside>

                {/* Content */}
                <main
                    className="p-2 "
                    style={{
                        gridArea: "content",
                        overflowY: "auto"
                    }}
                >
                    <Card
                        className="shadow-md bg-gradient-to-br from-white to-gray-500 dark:bg-[#282a36] dark:bg-none p-5"
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        {children}
                    </Card>
                </main>
            </div>
        </>
    );
};

export default ManagerLayout;

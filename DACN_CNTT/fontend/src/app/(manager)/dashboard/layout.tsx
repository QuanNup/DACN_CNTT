import React, { ReactNode } from "react";
import SideBar from "../ui/dashboard/sidebar/sidebar";
import { Card } from "@nextui-org/card";

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
            className="shadow-md bg-gradient-to-br from-white to-gray-500 dark:bg-[#282a36] dark:bg-none"
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

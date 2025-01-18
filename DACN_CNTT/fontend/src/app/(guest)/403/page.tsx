
import ForbiddenPage from "@/components/auth/403";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "403 - Không có quyền truy cập",
};

export default function PageNoAccess() {
    return (
        <>
            <ForbiddenPage />
        </>
    );
}
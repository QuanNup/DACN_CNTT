
'use client'
import { useRouter } from "next/navigation";
import { Button, Card } from "@nextui-org/react";

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card style={{ maxWidth: "400px", padding: "24px", textAlign: "center" }}>
                <h1 style={{ color: "#e53e3e", fontSize: "60px" }}>
                    403
                </h1>
                <p style={{ marginTop: "16px", fontSize: "18px" }}>
                    Bạn không có quyền truy cập trang này.
                </p>
                <Button
                    onClick={() => router.push("/")}
                    style={{ marginTop: "24px" }}
                    color="default"
                >
                    Quay lại trang chủ
                </Button>
            </Card>
        </div>
    );
}
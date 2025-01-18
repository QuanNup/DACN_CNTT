"use client";

import { useState, useEffect } from "react";
import { Table, Button, Card, TableCell, TableRow, TableHeader, TableBody, TableColumn } from "@nextui-org/react";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

const StoreManagerPage = () => {
    const { data: session } = useSession();
    interface Store {
        id: string | number;
        name: string;
        owner: string;
        status: string;
    }

    const [stores, setStores] = useState<Store[]>([]);

    useEffect(() => {
        // Fetch store data from an API or database
        const fetchStores = async () => {
            const response = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/store-pending`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
            })
            if (response.statusCode !== 200) {
                console.error("Failed to fetch stores");
                return;
            }
            setStores(response.data);
        };

        fetchStores();
    }, []);

    const handleApprove = (storeId: string | number) => {
        // Handle store approval logic
        console.log(`Approved store with ID: ${storeId}`);
    };

    const handleReject = (storeId: string | number) => {
        // Handle store rejection logic
        console.log(`Rejected store with ID: ${storeId}`);
    };

    return (
        <div className="container mx-auto p-4">
            <Card>
                < h2>Quản lý cửa hàng</h2>
                <Table
                    aria-label="Example table with dynamic content"
                    style={{
                        height: "auto",
                        minWidth: "100%",
                    }}
                >
                    <TableHeader>
                        <TableColumn>Tên cửa hàng</TableColumn>
                        <TableColumn>Chủ cửa hàng</TableColumn>
                        <TableColumn>Trạng thái</TableColumn>
                        <TableColumn>Hành động</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.id}>
                                <TableCell>{store.name}</TableCell>
                                <TableCell>{store.owner}</TableCell>
                                <TableCell>{store.status}</TableCell>
                                <TableCell>
                                    <Button

                                        color="success"
                                        onClick={() => handleApprove(store.id)}
                                    >
                                        Xét duyệt
                                    </Button>
                                    <Button

                                        color="danger"
                                        onClick={() => handleReject(store.id)}
                                    >
                                        Từ chối
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default StoreManagerPage;
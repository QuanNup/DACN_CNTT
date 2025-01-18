"use client";
import React, { createContext, useContext, useState } from 'react';
import { sendRequest } from "@/utils/api";
import { message } from 'antd';
import { useSession } from 'next-auth/react';

interface OrderContextProps {
    Orders: any[];
    fetchOrders: () => Promise<void>;
    setOrders: React.Dispatch<React.SetStateAction<any[]>>;
}
const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const [Orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const fetchOrders = async () => {
        try {
            const response = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/user-orders`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
            });
            if (response.statusCode === 200) {
                const orderData = response.data;
                setOrders(orderData || []);
            } else {
                message.error('Lỗi lấy thông tin sản phẩm đặt hàng')
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch order:", error);
            setOrders([]);
        }
    }

    const fetchProduct = async () => {
        const productVariants = Orders.flatMap((group: any) =>
            group.items.map((item: any) => ({
                product_id: item.productId,
                variant: item.variant || null, // Lấy `variant` từ item nếu có
            }))
        );
        try {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/batch-details`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`,
                },
                body: {
                    productVariants,
                },
            });
            if (res.statusCode === 201) {
                setProducts(res.data || []);
            } else {
                message.error('Lỗi lấy thông tin sản phẩm đặt hàng')
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin sản phẩm đặt hàng: ", error);
            message.error('Lỗi lấy thông tin sản phẩm đặt hàng')
            setProducts([]);
        }
    };


    return (
        <OrderContext.Provider value={{ Orders, fetchOrders, setOrders }}>
            {children}
        </OrderContext.Provider>
    );
}
export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};
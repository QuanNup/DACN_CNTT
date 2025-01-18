
"use client";
import React, { createContext, useContext, useState } from 'react';
import { sendRequest } from "@/utils/api";
import { useSession } from 'next-auth/react';

interface ShoppingCartContextProps {
    productsCart: any[];
    fetchShoppingCart: () => Promise<void>;
    setProductsCart: React.Dispatch<React.SetStateAction<any[]>>;
}

const ShoppingCartContext = createContext<ShoppingCartContextProps | undefined>(undefined);

export const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const [productsCart, setProductsCart] = useState<any[]>([]);
    const fetchShoppingCart = async () => {
        try {
            const response = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/get-all-shopping-cart`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
            });

            const cartData = response.data;

            // Kiểm tra nếu không có items thì trả về null
            if (!cartData || cartData.length === 0 || !cartData.some((cart: any) => cart.items && cart.items.length > 0)) {
                setProductsCart([]); // Nếu không có sản phẩm trong giỏ hàng, trả về mảng rỗng
                return; // Dừng việc gọi API tiếp theo
            }

            const productVariants = cartData.flatMap((cart: any) =>
                cart.items.map((item: any) => ({
                    product_id: item.product_id,
                    variant: item.variant || null, // Lấy `variant` từ item nếu có
                }))
            );
            const productResponse = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/batch-details`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user.access_token}`,
                },
                body: {
                    productVariants,
                }, // Gửi danh sách productIds trong body
            });

            const productDetails = productResponse.data;

            const stores = productDetails.map((product: any) => ({
                store_id: product.store_id
            }))

            const storeResponse = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/store/get-store-by-id`,
                method: "POST",
                body: {
                    stores
                }
            })

            const storeDetails = storeResponse.data
            const enrichedCart = cartData.map((cart: any) => ({
                ...cart,
                items: cart.items.map((item: any) => {
                    const product = productDetails.find((p: any) =>
                        p.product_id === item.product_id &&
                        (!item.variant || p.images.some((img: any) => img.variants === item.variant)) // Nếu không có `variant`, chỉ so sánh `product_id`
                    )
                    const store = storeDetails.find((s: any) => s.store_id === product?.store_id);
                    return {
                        ...item,
                        product,
                        store
                    };
                }),
            }));
            setProductsCart(enrichedCart);
        } catch (error) {
            console.error("Failed to fetch shopping cart:", error);
            setProductsCart([]);
        }
    };

    return (
        <ShoppingCartContext.Provider value={{ productsCart, fetchShoppingCart, setProductsCart }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => {
    const context = useContext(ShoppingCartContext);
    if (!context) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};

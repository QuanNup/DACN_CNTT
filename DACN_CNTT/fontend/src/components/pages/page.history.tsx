'use client'
import { useOrder } from "@/app/context/OrderContext";
import { useShoppingCart } from "@/app/context/ShoppingCartContext";
import { sendRequest } from "@/utils/api";
import { Button, Card, CardBody, Image, Tab, Tabs } from "@nextui-org/react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useSession } from "next-auth/react";
import { formatPrice } from "@/utils/format";

const MAX_ITEMS = 2;

interface OrderTabProps {
    Orders: any[]
    products: any[]
    status: string
    handleAction: (order: any) => void
}

const fetchProducts = async (Orders: any, session: any) => {
    if (!Orders || Orders.length === 0) return []; // Nếu Orders trống, trả về mảng rỗng

    const productVariants = Orders.flatMap((group: any) =>
        group.items.map((item: any) => ({
            product_id: item.productId,
            variant: item.variant || null, // Lấy `variant` từ item nếu có
        }))
    );

    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/batch-details`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user.access_token}`,
        },
        body: { productVariants },
    });

    if (res.statusCode !== 201) {
        throw new Error('Failed to fetch product details');
    }

    return res.data;
};
const OrderTab: React.FC<OrderTabProps> = ({ Orders, products, status, handleAction }) => {
    const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});
    const filteredOrders = Orders.filter((order: any) => order.status === status);

    if (filteredOrders.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-center">
                <p className="text-gray-500 text-lg">Không có đơn hàng nào.</p>
            </div>
        );
    }

    const toggleExpand = (orderId: string) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    return (
        <div className="p-6 space-y-6 w-full">
            {filteredOrders.map((order: any) => {
                const isExpanded = expandedOrders[order.orderId] || false;
                const itemsToShow = isExpanded
                    ? order.items // Hiển thị tất cả sản phẩm nếu đã mở rộng
                    : order.items.slice(0, MAX_ITEMS); // Chỉ hiển thị sản phẩm tối đa

                return (
                    <motion.div
                        key={order.orderId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card key={order.orderId} className="p-4 bg-default-100 shadow-md rounded-md">
                            <div className="space-y-4">
                                {/* Danh sách sản phẩm */}
                                {itemsToShow.map((item: any, index: number) => {
                                    const product = products.find(
                                        (p: any) =>
                                            p.product_id === item.productId &&
                                            order.status === status
                                    );

                                    if (!product) return null;

                                    return (
                                        <div
                                            key={item.productId}
                                            className={`flex items-center space-x-4 ${index !== 0 ? 'border-t border-gray-100 pt-4' : ''}`}
                                        >
                                            {/* Hình ảnh sản phẩm */}
                                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md  ">
                                                <Image
                                                    isBlurred
                                                    src={product.images?.find((img: any) => img.variants === item.variant)?.url || ''}
                                                    alt={product.product_name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover object-center"
                                                />
                                            </div>

                                            {/* Thông tin sản phẩm */}
                                            <div className="flex-grow">
                                                <h3 className="text-base font-medium ">{product.product_name}</h3>
                                                <p className="mt-1 text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                            </div>

                                            {/* Giá sản phẩm */}
                                            <p className="text-sm font-medium">{formatPrice(item.price || 0)}</p>
                                        </div>
                                    );
                                })}

                                {/* Nút Xem thêm / Ẩn bớt */}
                                {order.items.length > MAX_ITEMS && (
                                    <div className="text-center mt-4">
                                        <Button
                                            radius="sm"
                                            size="sm"
                                            onClick={() => toggleExpand(order.orderId)}
                                        >
                                            {isExpanded ? (
                                                <>
                                                    Ẩn bớt <ChevronUp className="ml-2 h-4 w-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Xem thêm <ChevronDown className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {/* Tổng tiền và nút hành động */}
                                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                                    <span className="text-lg font-semibold">
                                        Tổng: <span className="text-[#F31260]">{formatPrice(order.totalAmount)}</span>
                                    </span>
                                    <Button
                                        radius="sm"
                                        color="danger"
                                        className="px-6 py-2 font-medium"
                                        onClick={() => handleAction(order)}
                                    >
                                        {status === 'PENDING' ? 'Thanh toán' : 'Mua lại'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};



const ProductCardOrder = ({ Orders, session, products }: { Orders: any, session: any, products: any }) => {

    // const fetchAddToCart = async () => {
    //     try {
    //         message.loading("Đang thêm sản phẩm vào giỏ hàng...", 0);
    //         const res = await sendRequest<IBackendRes<any>>({
    //             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/add-to-cart`, // Endpoint thêm vào giỏ hàng
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
    //             },
    //             body: {
    //                 items
    //             },
    //         });
    //         if (res.statusCode === 201) {
    //             message.success("Sản phẩm đã được thêm vào giỏ hàng!")
    //             fetchShoppingCart();
    //         } else {
    //             message.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi thêm vào giỏ hàng:", error);
    //         message.error("Lỗi xảy ra khi thêm vào giỏ hàng!");
    //     }
    // };

    const handleReorder = (order: any) => {
        console.log("Reorder:", order);
        message.success("Danh sách sản phẩm đã được thêm vào giỏ hàng!");
    };

    const handlePay = (order: any) => {
        console.log("Pay:", order);
        message.success("Chuyển hướng đến trang thanh toán.");
    };

    return (
        <main className="min-h-screen bg-gradient-to-br py-2 px-2 sm:px-6 lg:px-8">
            <div className="mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Quản lý đơn hàng</h1>
                <Tabs
                    //color="danger"
                    aria-label="Options"
                    color="danger"
                    className="flex flex-col items-center"
                    classNames={{
                        tabList: "gap-6 w-full flex justify-center rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-[#22d3ee]",
                        tab: "max-w-fit px-0 h-12",
                        tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                    }}
                    variant="underlined"
                >
                    <Tab key="all" title="Tất cả">
                        <OrderTab Orders={Orders} products={products} status="SUCCESS" handleAction={handleReorder} />
                    </Tab>
                    <Tab key="notpay" title="Chưa thanh toán">
                        <OrderTab Orders={Orders} products={products} status="PENDING" handleAction={handlePay} />
                    </Tab>
                    <Tab key="completed" title="Hoàn thành">
                        <OrderTab Orders={Orders} products={products} status="SUCCESS" handleAction={handleReorder} />
                    </Tab>
                </Tabs>
            </div>
        </main>
    )
}

export default function History() {
    const { data: session, status } = useSession();
    const { Orders, fetchOrders } = useOrder();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (session) fetchOrders();
    }, [session])

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts(Orders, session);
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('Không thể tải thông tin sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        if (Orders.length > 0 && session) {
            fetchProductData();
        }
    }, [Orders, session])

    if (loading) return <div>Loading...</div>

    if (error) return <div>{error}</div>

    return (
        <>
            <ProductCardOrder Orders={Orders} session={session} products={products} />
        </>
    )
}
'use client';
import { useCartContext } from "@/app/context/CartContext";
import { useShoppingCart } from "@/app/context/ShoppingCartContext";
import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import { Button, Card, Image, Spinner, Badge, Input, Alert } from "@nextui-org/react";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import Loader from "../ui/Loader";
import ButtonAddToCart from "../ui/ButtonAddToCart";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/utils/format";

const ProductCardDetal = ({ product }: { product: any }) => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string>(product?.images?.[0]?.url);
    const images = product?.images?.length ? product.images : Array(10).fill(null);
    const [variant, setVariant] = useState<string>(product?.images?.[0]?.variants);
    const { fetchShoppingCart } = useShoppingCart();

    const fetchAddToCart = async () => {
        try {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/add-to-cart`, // Endpoint thêm vào giỏ hàng
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
                body: {
                    items: [
                        {
                            product_id: product?.product_id,
                            quantity: quantity,
                            price: product?.product_price,
                            variant: variant
                        },
                    ],
                },
            });
            if (res.statusCode === 201) {
                handleAddToCartAnimate()
                message.success("Sản phẩm đã được thêm vào giỏ hàng!")
                await fetchShoppingCart();
            } else {
                message.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            message.error("Lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    };

    const [loadingStates, setLoadingStates] = useState<boolean[]>(
        Array(images.length).fill(true) // Mặc định tất cả card đang tải
    );

    const handleLoad = (idx: number) => {
        setLoadingStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[idx] = false; // Ẩn spinner cho ảnh đã tải xong
            return updatedStates;
        });

    };

    const handleError = (idx: number) => {
        setLoadingStates((prevStates) => {
            const updatedStates = [...prevStates];
            updatedStates[idx] = false; // Ẩn spinner nếu ảnh bị lỗi
            return updatedStates;
        });
    };

    const [isError, setIsError] = React.useState(false);
    //const [quantity, setQuantity] = useState<number>(1);
    const [quantity, setQuantity] = useState<number | null>(1);

    const [isMobile, setIsMobile] = useState(false);

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // 640px tương ứng với breakpoint `sm`
        };

        handleResize(); // Kiểm tra lần đầu khi load trang
        window.addEventListener("resize", handleResize); // Lắng nghe sự thay đổi kích thước màn hình

        return () => window.removeEventListener("resize", handleResize); // Dọn dẹp sự kiện
    }, [])

    const { cartIconRef } = useCartContext();

    const handleAddToCartAnimate = () => {
        const productImage = document.querySelector(".main-product-image") as HTMLElement;

        if (productImage && cartIconRef.current) {
            const productRect = productImage.getBoundingClientRect();
            const cartRect = cartIconRef.current.getBoundingClientRect();

            const flyingImage = document.createElement("img");
            flyingImage.src = mainImage
            flyingImage.style.position = "fixed";
            flyingImage.style.left = `${productRect.left}px`;
            flyingImage.style.top = `${productRect.top}px`;
            flyingImage.style.width = `${productRect.width}px`;
            flyingImage.style.height = `${productRect.height}px`;
            flyingImage.style.transition = "all 1s ease";
            flyingImage.style.zIndex = "1000";
            document.body.appendChild(flyingImage);

            // Move image to cart icon
            setTimeout(() => {
                flyingImage.style.left = `${cartRect.left + cartRect.width / 2}px`;
                flyingImage.style.top = `${cartRect.top + cartRect.height / 2}px`;
                flyingImage.style.width = "0px";
                flyingImage.style.height = "0px";
                flyingImage.style.opacity = "0";
            }, 0);

            // Remove image after animation
            flyingImage.addEventListener("transitionend", () => {
                flyingImage.remove();
            });
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-8"
            style={{
                padding: isMobile ? '16px' : '32px',
            }}
        >
            <div className="grid lg:grid-cols-2 gap-8"
                style={{
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '16px' : '32px',
                }}
            >
                {/* Hình ảnh sản phẩm */}
                <div className="space-y-4">
                    <Card
                        isBlurred
                        isHoverable
                        isPressable
                        className="w-full flex justify-center items-center relative"
                        style={{
                            padding: isMobile ? '8px' : '14px',
                            //width: isMobile ? '100%' : '500px',
                            //height: isMobile ? '' : '400px',
                        }}
                    >
                        {(loading || isError) && (
                            <div className="absolute inset-0 flex justify-center items-center bg-default-100">
                                <Loader />
                            </div>
                        )}
                        <Image
                            isBlurred
                            src={mainImage}
                            alt={product?.images?.length || "Hình ảnh sản phẩm"}
                            className="w-full h-auto object-cover p-4 main-product-image"
                            style={{
                                //width: isMobile ? '100%' : '500px',
                                //height: isMobile ? '200px' : '500px',
                            }}
                            onLoad={() => setLoading(false)} // Khi ảnh load xong, ẩn spinner
                            onError={() => {
                                setLoading(true);
                                setIsError(true); // Đặt cờ lỗi
                            }}
                        />
                    </Card>
                    <div className="flex flex-wrap gap-2">
                        {images.map((img: any, idx: number) => (
                            <Card
                                isBlurred
                                key={idx}
                                isHoverable
                                isPressable
                                style={{
                                    padding: isMobile ? '4px' : '8px',
                                }}
                                className="flex justify-center items-center relative"
                                onClick={() => {
                                    setMainImage(img?.url)
                                    setVariant(img?.variants)
                                }} // Cập nhật hình ảnh chính
                            >
                                {loadingStates[idx] && (
                                    <div className="absolute inset-0 flex justify-center items-center bg-default-100">
                                        <Loader size={96} />
                                    </div>
                                )}
                                <Image
                                    isBlurred
                                    src={img?.url}
                                    alt={`Hình phụ ${idx + 1}`}
                                    style={{
                                        width: isMobile ? '60px' : '80px',
                                        height: isMobile ? '60px' : '80px',
                                    }}
                                    className="w-full h-auto object-cover p-2"
                                    onLoad={() => handleLoad(idx)}
                                    onError={() => handleError(idx)}
                                />
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold"
                        style={{
                            fontSize: isMobile ? '18px' : '24px',
                        }}
                    >{product?.product_name || "Tên sản phẩm"}</h1>

                    <div className="text-2xl font-semibold text-red-500"
                        style={{
                            fontSize: isMobile ? '16px' : '20px',
                        }}
                    >
                        {formatPrice(product.product_price) || 'Price unavailable'}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-800"
                        style={{
                            fontSize: isMobile ? '12px' : '14px',
                        }}
                    >
                        <span>{product.product_rating || '0'} ⭐</span>
                        <span>|</span>
                        <span>{product.reviewsCount || 0} Đánh giá</span>
                        <span>|</span>
                        <span>{product.purchase_count || 0} Đã bán</span>
                    </div>
                    <Button isDisabled variant="faded" size="sm">Xuất xứ: {product?.origin || 'VietNam'}</Button>
                    <div>
                        <h4 className="font-semibold mb-2">Mẫu:</h4>
                        <div className="flex flex-wrap gap-2">
                            {images.map((img: any, idx: number) => (
                                <Card
                                    isBlurred
                                    key={idx}
                                    isHoverable
                                    isPressable
                                    style={{
                                        padding: isMobile ? '4px' : '8px',
                                    }}
                                    className="grid grid-cols-2"
                                    onClick={() => {
                                        setMainImage(img?.url)
                                        setVariant(img?.variants)
                                    }}
                                >
                                    <Card
                                        isBlurred
                                        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                        }}
                                    >
                                        {loadingStates[idx] && (
                                            <div className="absolute inset-0 flex justify-center items-center bg-default-100">
                                                <Loader size={50} />
                                            </div>
                                        )}
                                        <Image
                                            isBlurred
                                            src={img?.url}
                                            alt={`Hình phụ ${idx + 1}`}
                                            className="w-full h-auto object-cover "
                                            onLoad={() => handleLoad(idx)}
                                            onError={() => handleError(idx)}
                                        />
                                    </Card>

                                    <div
                                        style={{
                                            padding: '2px',
                                            fontSize: '10px',
                                            height: '100%',
                                            alignContent: "center"
                                        }}
                                    >
                                        {img?.variants}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold"
                            style={{
                                fontSize: isMobile ? '14px' : '16px',
                            }}
                        >Số lượng:</h4>
                        <div className="flex items-center gap-3 mt-2">
                            {/* Nút Giảm */}
                            <Button variant="bordered" color="default" size={isMobile ? 'sm' : 'md'} onPress={() => setQuantity((prev) => Math.max((prev ?? 1) - 1, 1))}>-</Button>
                            <Input
                                classNames={{
                                    innerWrapper: "bg-transparent",
                                    input: "text-sm",
                                }}
                                variant='bordered'
                                type="number"
                                value={quantity === null ? "" : quantity.toString()} // Chuyển thành chuỗi
                                onChange={(e) => {
                                    const value = e.target.value.trim();
                                    if (value === "") {
                                        setQuantity(null);
                                    } else {
                                        const numericValue = parseInt(value, 10);
                                        setQuantity(numericValue > 0 ? numericValue : null);
                                    }
                                }}
                                onBlur={() => {
                                    if (quantity === null || quantity < 1) {
                                        setQuantity(1);
                                    }
                                }}
                                style={{
                                    width: isMobile ? '50px' : '80px',
                                }}
                                className="w-20"
                            />
                            <Button variant="bordered" color="default" size={isMobile ? 'sm' : 'md'} onPress={() => setQuantity((prev) => (prev ?? 1) + 1)}>+</Button>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <ButtonAddToCart size={isMobile ? "md" : "lg"} onClick={fetchAddToCart} />
                        <Button color="default" size={isMobile ? 'md' : 'lg'} variant="shadow" className="bg-black text-white">
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default function ProductDetail(props: any) {
    const { data: session, status } = useSession()
    const { product_id } = props
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [quantity, setQuantity] = useState<number>(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/product-detail/${product_id}`,
                    method: "GET",
                });

                setProduct(res.data);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [product_id])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>
    }

    if (!product) {
        return <div className="text-center">Sản phẩm không tồn tại</div>;
    }

    return (
        <>
            <ProductCardDetal product={product} />
        </>

    );
}

'use client'
import { Badge, Button, Card, Image, Spinner, Pagination as NextUIPagination } from "@nextui-org/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import React, { useEffect, useState } from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination as SwiperPagination } from "swiper/modules";
import { sendRequest } from "@/utils/api";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Loader from "../ui/Loader";
import Footer from "../layout/user/app.footer.user";
import { formatPrice } from "@/utils/format";
import { SkeletonCard } from "../ui/SkeletonCard";
import { Fetcher } from "@/utils/fetcher";
import { UseIsMobile } from "@/components/another/useIsMobile";

export const ProductCard = ({ product }: { product: any }) => {
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = React.useState(false);
    const isMobile = UseIsMobile();
    const router = useRouter();

    const handleNavigation = () => {
        router.push(`/product_detail/${product.product_id}`);
    }

    return (
        <>
            <Card
                onClick={handleNavigation}
                isHoverable
                isPressable
                radius="sm"
                className="flex flex-col items-start justify-between dark:bg-gradient-to-br dark:from-gray-500 dark:to-gray-900 duration-300 hover:scale-110"
                style={{
                    width: isMobile ? '140px' : '230px',
                    padding: isMobile ? '8px' : '12px',
                    height: isMobile ? '220px' : '300px',
                }}

            >
                {/* Ảnh sản phẩm */}
                <div className="relative w-full mb-4 "
                    style={{
                        height: isMobile ? '100px' : '150px',
                        marginBottom: isMobile ? '8px' : '12px',
                    }}
                >
                    <div className="w-full h-full rounded-lg relative  overflow-hidden" >
                        {loading && (
                            <div className="absolute inset-0 flex justify-center items-center bg-default-100">
                                <Loader />
                            </div>
                        )}
                        <Image
                            isBlurred
                            src={product?.images?.[0]?.url}
                            alt={product?.product_name}
                            className="object-cover w-full h-auto px-10"
                            onLoad={() => setLoading(false)} // Khi ảnh load xong, ẩn spinner
                            onError={() => {
                                setLoading(true);
                                setIsError(true); // Đặt cờ lỗi
                            }}
                        />
                    </div>

                    {product?.is_favorite && (
                        <Badge
                            color="danger"
                            variant="flat"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                fontSize: '12px',
                                padding: '5px 8px',
                            }}
                        >
                            Yêu thích
                        </Badge>
                    )}
                </div>

                {/* Thông tin sản phẩm */}
                <h3 className="font-medium text-sm mb-1 line-clamp-2 text-ellipsis"
                    style={{
                        fontSize: isMobile ? '12px' : '14px', // Chữ nhỏ hơn cho mobile
                        lineHeight: isMobile ? '1.2' : '1.5',
                        marginBottom: isMobile ? '4px' : '8px',
                    }}>
                    {product.product_name || "Tên sản phẩm"}
                </h3>

                {/* Giá sản phẩm */}
                <div className="flex items-center gap-2 mb-2">
                    <span
                        className=" font-bold text-lg"
                        style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: "bold", color: '#FF4500' }}>
                        {formatPrice(product.product_price)}
                    </span>
                    {product?.discount && (
                        <span
                            className="text-xs px-1 py-1 rounded text-red-500 bg-[#FFA07A]"
                            style={{ fontSize: isMobile ? '10px' : '12px', padding: isMobile ? '2px 4px' : '4px 8px', }}
                        >
                            -{product.discount}%
                        </span>
                    )}
                    <span
                        className="text-xs px-1 py-1 rounded bg-[#FFA07A] text-red-500"
                        style={{ fontSize: isMobile ? '10px' : '12px', padding: isMobile ? '2px 4px' : '4px 8px', }}
                    >
                        -10%
                    </span>

                </div>

                {/* Đánh giá và số lượt mua */}
                <div
                    className="flex items-center justify-between w-full text-sm text-[#696969]"
                    style={{ fontSize: isMobile ? '10px' : '12px' }}
                >
                    <div className="flex items-center gap-1">
                        <span className="text-[#FFD700]">⭐</span>
                        <span>{product?.rating || "4.5"}</span>
                        <span>Đã bán {product?.purchase_count || "1k"}</span>
                    </div>
                    <span>🌍 {product?.origin || "Nội địa"}</span>
                </div>
            </Card>
        </>
    )
};



export default function HomePage() {
    const PAGE_SIZE = 20;
    const [totalPages, setTotalPages] = useState(1);
    const [latestProducts, setLatestProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [page, setPage] = useState(1); // Trang hiện tại
    const [pageCategory, setPageCategory] = useState(1); // Trang hiện tại
    const [loading, setLoading] = useState(true);

    const { data: featuredProducts, error: featuredError } = useSWR(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/get-hot-products`,
        Fetcher,
        {
            revalidateOnFocus: true, // tải lại khi người dùng quay lại tab
            shouldRetryOnError: true, // Tiếp tục retry khi có lỗi
            errorRetryInterval: 5000, // Retry mỗi 5 giây nếu lỗi
        }
    )

    const loadingFeatured = !featuredProducts && !featuredError;

    const safeFeaturedProducts = featuredProducts || [];

    const fetchLatestProducts = async (page: number) => {
        setLoading(true);
        try {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/get-all-products`,
                method: "GET",
                queryParams: { current: page, pageSize: PAGE_SIZE },
            });

            if (res.data.results) {
                setLatestProducts(res.data.results); // Cập nhật danh sách sản phẩm
                setTotalPages(res.data.totalPages); // Cập nhật tổng số trang
            }
        } catch (error) {
            console.error("Failed to fetch latest products:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchcategories = async (pageCategory: number) => {
        const PAGE_SIZE_CATEGORY = 20;
        try {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/get-all-categories`,
                method: "GET",
                queryParams: { current: pageCategory, pageSize: PAGE_SIZE_CATEGORY },
            });
            if (res.data.results) {
                setCategories(res.data.results); // Cập nhật danh sách sản phẩm
            }
        } catch (error) {
            console.error("Failed to fetch latest products:", error);
        }
    }

    useEffect(() => {
        fetchcategories(pageCategory)
    }, [pageCategory])

    useEffect(() => {
        fetchLatestProducts(page);
    }, [page])

    const [isMobile, setIsMobile] = useState(false);

    // Kiểm tra kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // 640px tương ứng với breakpoint `sm`
        };

        handleResize(); // Kiểm tra lần đầu khi load trang
        window.addEventListener("resize", handleResize); // Lắng nghe sự thay đổi kích thước màn hình

        return () => window.removeEventListener("resize", handleResize); // Dọn dẹp sự kiện
    }, []);
    return (
        <div className="flex flex-col justify-center items-center gap-8 p-4 h-full w-full ">
            <div className="w-full max-w-[1400px]">
                <Card className="p-4" radius="sm" isBlurred>
                    <h2 className="text-xl font-bold text-center mb-2">Các sản phẩm nổi bật</h2>
                    <Swiper
                        parallax
                        modules={[Navigation, SwiperPagination, Autoplay, EffectCoverflow]}
                        slidesPerView={isMobile ? 2 : 4}
                        spaceBetween={isMobile ? 8 : 16}
                        pagination={{
                            clickable: true,
                        }}
                        loop
                        effect="coverflow"
                        coverflowEffect={{
                            rotate: isMobile ? 30 : 50,
                            stretch: isMobile ? 10 : 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                            scale: 1
                        }}
                        navigation
                        //fadeEffect={{ crossFade: true, }}
                        autoplay={{
                            delay: 3000, // 3 giây mỗi slide
                            disableOnInteraction: false, // Không dừng autoplay khi người dùng tương tác
                        }}
                        style={{
                            width: isMobile ? '100%' : '80%',
                            margin: '0 auto',
                            padding: isMobile ? '8px' : '10px',
                        }}
                    >
                        {loadingFeatured || safeFeaturedProducts.length === 0
                            ? Array.from({ length: 10 }).map((_, index) => (
                                <SwiperSlide key={index}>
                                    <SkeletonCard />
                                </SwiperSlide>
                            ))
                            : safeFeaturedProducts.map((product: any) => (
                                <SwiperSlide key={product.product_id}>
                                    <ProductCard product={product} />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </Card>
            </div>
            <div className="w-full max-w-[1400px]">
                <Card className="p-4" radius="sm" isBlurred>
                    {categories.map((category) => (
                        <h1>{category.category_name}</h1>
                    ))}
                </Card>
            </div>
            <div className="w-full max-w-[1400px]">
                <Card isBlurred radius="sm" className="p-4">
                    <h2 className="text-xl font-bold text-center my-5">Sản phẩm mới nhất</h2>
                    <div className="flex flex-wrap justify-center gap-4 "
                        style={{
                            gap: isMobile ? '8px' : '16px', // Khoảng cách nhỏ hơn cho mobile
                        }}
                    >
                        {
                            latestProducts.map((product) => <ProductCard key={product.product_id} product={product} />)
                        }
                    </div>
                    {loading && (
                        <div className="text-center mt-12">
                            <Spinner size="lg" color="default" />
                        </div>
                    )}
                    <div className="text-center mt-4">
                        {page === 1 && (
                            <Button
                                variant="bordered"
                                radius="sm"
                                size="sm"
                                color="default"
                                onClick={() => {
                                    setPage(2); // Chuyển sang trang 2
                                    fetchLatestProducts(2); // Tải dữ liệu cho trang 2
                                }}
                            >
                                Xem thêm <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {page > 1 && (
                        <div className="flex justify-center mt-8">
                            <NextUIPagination
                                variant="bordered"
                                radius="sm"
                                color="default"
                                showShadow
                                showControls
                                initialPage={page}
                                total={totalPages}
                                onChange={(newPage) => {
                                    setPage(newPage); // Cập nhật số trang hiện tại
                                    fetchLatestProducts(newPage); // Gọi API với trang mới
                                }}
                            />
                        </div>
                    )}
                </Card>
            </div>
            <Footer />
        </div>
    )
}

'use client';
import NextLink from "next/link";
import { CartIcon, NotificationIcon, SearchIcon, TwitterIcon } from "@/components/another/icons";
import { DownOutlined, GithubFilled, InstagramFilled } from "@ant-design/icons";
import { Avatar, Badge, Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Input, Kbd, Link, Listbox, ListboxItem, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Navbar as NextUINavbar, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ThemeSwitch } from "@/components/another/theme-switch";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "@/app/context/ShoppingCartContext";
import { useCartContext } from "@/app/context/CartContext";
import { MdFacebook } from "react-icons/md";
import { formatPrice } from "@/utils/format";

interface ProductSuggestion {
    product_id: string;
    product_name: string;
}

interface StoreSuggestion {
    store_id: string;
    store_name: string;
}

interface CategorySuggestion {
    category_id: string;
    category_name: string;
}

interface SearchSuggestions {
    products: ProductSuggestion[];
    stores: StoreSuggestion[];
    categories: CategorySuggestion[];
}
type ListboxWrapperProps = {
    children: React.ReactNode; // Định nghĩa kiểu cho children
};

export const ListboxWrapper: React.FC<ListboxWrapperProps> = ({ children }) => (
    <Card
        className="absolute z-10 rounded shadow-lg mt-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 "
        style={{
            width: '100%',
        }}
    >
        <div
            //className="absolute z-10 rounded shadow-lg mt-1"
            style={{
                width: '100%',
                maxHeight: '400px',
                overflowY: 'auto',
                scrollbarWidth: 'none'
            }}
        >
            {children}
        </div>
    </Card>
);

export default function AppHeaderUser() {
    //const { session } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartIconRef } = useCartContext();
    const [query, setQuery] = useState(""); // Từ khóa tìm kiếm
    const [suggestions, setSuggestions] = useState<SearchSuggestions>({
        products: [],
        stores: [],
        categories: [],
    });
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [showSuggestions, setShowSuggestions] = useState(false); // Hiển thị gợi ý

    useEffect(() => {
        if (session?.error === "RefreshTokenExpired") {
            console.log("Session expired. Logging out...");
            signOut();
        }
    }, [session]);

    const items = [
        {
            key: "settings",
            label: "Cài đặt",
        },
        {
            key: "signOut",
            label: "Đăng xuất",
        },
    ];

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

    /* Seach */
    const fetchSuggestions = async (searchQuery: string) => {
        try {
            const response = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/search/suggestions`,
                method: "GET",
                queryParams: { q: searchQuery },
            });
            setLoading(true);
            setSuggestions(response.data || []);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            fetchSuggestions(value); // Gọi API tìm kiếm
            setShowSuggestions(true); // Hiển thị gợi ý
        } else {
            setSuggestions({
                products: [],
                stores: [],
                categories: [],
            }); // Xóa gợi ý khi không nhập
            setShowSuggestions(false);
        }
    };
    const handleSuggestionClick = (suggestion: any, suggestionLink: string, type: string) => {
        if (type === 'product') {
            router.push(`/product_detail/${suggestionLink}`);
        } else if (type === 'category') {
            router.push(`/category_detail/${suggestionLink}`);
        } else if (type === 'store') {
            router.push(`/store/${suggestionLink}`);
        }
        //router.push(`/product_detail/${suggestionLink}`);
        setQuery(suggestion); // Điền gợi ý đã chọn vào ô tìm kiếm
        setShowSuggestions(false); // Ẩn danh sách gợi ý
    };
    const searchInput = (
        <div className="relative  w-[600px] ">
            <Input
                value={query}
                onChange={handleInputChange}
                aria-label="Search"
                onFocus={() => setShowSuggestions(true)} // Hiển thị gợi ý khi focus
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Ẩn gợi ý khi mất focus
                classNames={{
                    innerWrapper: "bg-transparent",
                    input: "text-sm",
                }}
                //className="w-full h-10 px-3 border rounded"
                endContent={
                    <Kbd className="hidden lg:inline-block" keys={["command"]}>
                        K
                    </Kbd>
                }
                labelPlacement="outside"
                placeholder="Tìm kiếm"
                startContent={
                    <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="search"
                variant='bordered'
            />
            {/* Suggestions */}
            {showSuggestions && (
                <ListboxWrapper>
                    {/* Hiển thị sản phẩm */}
                    {suggestions.products.length > 0 && (
                        <Listbox
                            disabledKeys={["products"]}
                        >
                            <>
                                <ListboxItem key='products' className="px-4 py-2 font-semibold ">
                                    Sản phẩm
                                </ListboxItem>
                                {suggestions.products.map((product) => (
                                    <ListboxItem
                                        key={product.product_id}
                                        className="p-2  cursor-pointer"
                                        onClick={() => handleSuggestionClick(product.product_name, product.product_id, 'product')}
                                        href={`/product_detail/${product.product_id}`}
                                    >
                                        {product.product_name}
                                    </ListboxItem>

                                ))}
                            </>
                        </Listbox>
                    )}

                    {/* Hiển thị danh mục */}
                    {suggestions.categories.length > 0 && (
                        <Listbox
                            disabledKeys={["categories"]}
                        >
                            <>
                                <ListboxItem key='categories' className="px-4 py-2 font-semibold ">
                                    Danh mục
                                </ListboxItem>
                                {suggestions.categories.map((category) => (
                                    <ListboxItem
                                        key={category.category_id}
                                        className="p-2  cursor-pointer"
                                        onClick={() => handleSuggestionClick(category.category_name, category.category_id, 'category')}
                                    >
                                        {category.category_name}
                                    </ListboxItem>

                                ))}
                            </>
                        </Listbox>
                    )}

                    {/* Hiển thị cửa hàng */}
                    {suggestions.stores.length > 0 && (
                        <Listbox
                            disabledKeys={["stores"]}
                        >
                            <>
                                <ListboxItem key='stores' className="px-4 py-2 font-semibold ">
                                    Cửa hàng
                                </ListboxItem>
                                {suggestions.stores.map((store) => (
                                    <ListboxItem
                                        key={store.store_id}
                                        className="p-2  cursor-pointer"
                                        onClick={() => handleSuggestionClick(store.store_name, store.store_id, 'store')}
                                    >
                                        {store.store_name}
                                    </ListboxItem>

                                ))}
                            </>
                        </Listbox>
                    )}


                </ListboxWrapper>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="absolute text-gray-500 text-sm mt-1">
                    Đang tải...
                </div>
            )}
        </div>
    );

    /* Shopping cart */
    const [isOpen, setIsOpen] = useState(false);
    let hoverTimeout: NodeJS.Timeout;

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout); // Hủy nếu có timeout trước đó
        setIsOpen(true); // Hiển thị dropdown
    };

    const handleMouseLeave = () => {
        hoverTimeout = setTimeout(() => {
            setIsOpen(false); // Ẩn dropdown sau khi chuột ra khỏi vùng dropdown
        }, 1000); // Thời gian trì hoãn để tránh dropdown đóng ngay lập tức
    };

    const handleNavigateToCart = () => {
        // Ẩn dropdown trước khi chuyển hướng
        setIsOpen(false);
        // Chuyển đến trang giỏ hàng
        router.push('/shopping_cart');
    };

    const { productsCart, fetchShoppingCart } = useShoppingCart();
    useEffect(() => {
        if (session) {
            fetchShoppingCart();
        }
        // Fetch giỏ hàng khi component load
    }, []);
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
            <div className="flex items-center justify-between p-4 max-w-[1480px] mx-auto">
                {/* Left side with logo */}
                <div className="flex justify-start items-center gap-3">
                    <div className="max-w-fit">
                        <MdFacebook className="text-2xl hover:scale-125 duration-200 " />
                    </div>
                    <div className="max-w-fit">
                        <TwitterIcon className="text-2xl hover:scale-125 duration-200" />
                    </div>
                    <div className="max-w-fit">
                        <InstagramFilled className="text-2xl hover:scale-125 duration-200" />
                    </div>
                    <div className="max-w-fit">
                        <GithubFilled className="text-2xl hover:scale-125 duration-200" />
                    </div>
                </div>
                {/* Right side with cart and login/register or account/logout */}
                <div className="flex items-center gap-6">
                    <Popover placement="bottom" offset={20} showArrow={true}>
                        <PopoverTrigger>
                            <div className="flex items-center cursor-pointer">
                                <NotificationIcon className="text-default-500" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Popover Content</div>
                                <div className="text-tiny">This is the popover content</div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <ThemeSwitch />
                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-sm">
                                {session?.user?.name ?? session?.user?.email ?? ""}
                            </span>
                            <Dropdown backdrop="blur">
                                <DropdownTrigger>
                                    {session.user.image ? (
                                        <Avatar size={isMobile ? "sm" : "md"} isBordered src={session.user.image}>
                                            <DownOutlined />
                                        </Avatar>
                                    ) : (
                                        <Avatar size={isMobile ? "sm" : "md"} isBordered name={session?.user?.name ?? session?.user?.email ?? ""}>
                                            <DownOutlined />
                                        </Avatar>
                                    )}
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions" items={items} variant="faded">
                                    {item => (
                                        <DropdownItem
                                            key={item.key}
                                            className={item.key === "signOut" ? "text-danger" : ""}
                                            color={item.key === "signOut" ? "danger" : "default"}
                                            onClick={() => {
                                                if (item.key === 'signOut') {
                                                    signOut();
                                                }
                                                if (item.key === 'settings') {
                                                    router.push('/settings');
                                                }
                                            }}
                                        >
                                            {item.label}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Button
                                    as={Link}
                                    href="/auth/register"
                                    className="px-4 py-2 rounded-lg "
                                    size={isMobile ? 'sm' : 'lg'}
                                >
                                    <span className="">
                                        Đăng ký
                                    </span>
                                </Button>
                            </div>
                            <div className="relative group">
                                <Button
                                    as={Link}
                                    href="/auth/login"
                                    className=" relative rounded-lg  p-px font-semibold leading-6 text-white bg-gray-400 dark:bg-gray-800 shadow-2xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                                    size={isMobile ? 'sm' : 'lg'}
                                >
                                    <span
                                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    ></span>
                                    <span className="px-4 relative z-10 block w-full h-full rounded-lg bg-gray-500 dark:bg-gray-950 content-center">
                                        Đăng nhập
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <header
                className={`sticky top-0 z-50 w-full transition-colors duration-300 ${isScrolled
                    ? "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 "
                    : "bg-transparent"
                    }`}
            >
                <div className="grid grid-cols-3 items-center max-w-[1480px] mx-auto px-4">
                    <div className="flex items-center justify-start">
                        <NextLink className="flex justify-start items-center gap-1" href="/">
                            <img
                                src="/logo.png"
                                alt="QQ E-Commerce Logo"
                                //className="h-16 w-16"
                                width={80} // Giảm chiều rộng trên thiết bị nhỏ
                                height={80}

                            />
                            <p className="font-bold text-inherit" style={{ display: isMobile ? 'none' : 'block' }}>QQ E-Commerce</p>
                        </NextLink>
                    </div>
                    <div className="flex items-center justify-center">
                        {searchInput}
                    </div>
                    <div className="flex items-center justify-end">
                        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom" style={{ maxWidth: '500px', width: '450px' }}>
                            <DropdownTrigger>
                                {productsCart.length > 0 ? (
                                    <div className="flex items-center cursor-pointer"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        ref={cartIconRef}
                                    >
                                        <Badge color="danger" content={productsCart.map((cart) => (cart.items.length))}>
                                            <CartIcon className="text-default-500" size={35} onClick={handleNavigateToCart} />
                                        </Badge>
                                    </div>
                                ) : (

                                    <div className="flex items-center cursor-pointer"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        ref={cartIconRef}
                                    >
                                        <CartIcon className="text-default-500" size={35} onClick={handleNavigateToCart} />
                                    </div>
                                )}
                            </DropdownTrigger>
                            <DropdownMenu onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} disabledKeys={["empty"]}
                                style={{ width: '100%' }}
                            >
                                <>
                                    <DropdownItem
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            padding: "8px 10px",
                                            textAlign: 'center',
                                            backgroundColor: "transparent", // Không có màu nền khi hover
                                            cursor: "default", // Không thay đổi con trỏ chuột
                                        }}
                                        //className="no-hover"
                                        key="header"
                                    >
                                        Sản Phẩm Mới Thêm
                                    </DropdownItem>
                                    {productsCart.length > 0 ? (
                                        productsCart.map((cart) => (
                                            cart.items.slice(0, 5).map((item: any) => (
                                                <>
                                                    <DropdownItem
                                                        key={item.id}
                                                        className="p-2 w-full"
                                                        textValue={item.product?.product_name || "Tên sản phẩm"}
                                                        onClick={() => handleSuggestionClick(item.product.product_name, item.product.product_id, 'product')}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "grid",
                                                                gridTemplateAreas: `
                                                                    "image info price"
                                                                    `,
                                                                gridTemplateColumns: "15% 55% 30%", // Chia tỉ lệ: 30% hình ảnh, 55% thông tin, 15% giá
                                                                //alignItems: "center",
                                                                gap: "5px",
                                                                padding: "8px 10px",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {/* Hình ảnh sản phẩm */}
                                                            <Image
                                                                src={item.product?.images?.find((img: any) => img.variants === item.variant)?.url}
                                                                alt={item.product?.product_name}
                                                                width={50}
                                                                height={50}
                                                                style={{
                                                                    borderRadius: "8px",
                                                                    objectFit: "cover",
                                                                    width: "100%",
                                                                    height: "auto",
                                                                    gridArea: "image",
                                                                }}
                                                            />

                                                            {/* Thông tin sản phẩm */}
                                                            <div
                                                                style={{
                                                                    gridArea: "info",
                                                                }}
                                                            >
                                                                <p
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: "14px",
                                                                        fontWeight: "bold",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        width: "100%", // Giới hạn nội dung trong cột
                                                                    }}
                                                                >
                                                                    {item.product?.product_name || "Tên sản phẩm"}
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: "12px",
                                                                        color: "#666",
                                                                        overflow: "hidden",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    Phân loại: {item.variant}
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: "12px",
                                                                        color: "#666",
                                                                        overflow: "hidden",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    x{item.quantity}
                                                                </p>
                                                            </div>
                                                            {/* Khu vực Giá */}
                                                            <span
                                                                style={{
                                                                    gridArea: "price",
                                                                    fontSize: "14px",
                                                                    fontWeight: "bold",
                                                                    color: "#FF4500",
                                                                    textAlign: "left",
                                                                    overflow: "hidden",
                                                                    whiteSpace: "nowrap",
                                                                    textOverflow: "ellipsis",
                                                                }}
                                                            >
                                                                {formatPrice((item.product?.product_price || '0') * (item.quantity || 1))}
                                                            </span>
                                                        </div>
                                                    </DropdownItem>
                                                </>
                                            ))
                                        ))
                                    ) : (
                                        <DropdownItem
                                            key="empty"
                                            style={{
                                                textAlign: "center",
                                                padding: "10px 0",
                                            }}
                                        >
                                            Giỏ hàng trống
                                        </DropdownItem>
                                    )}

                                    {/* Footer */}
                                    <DropdownItem
                                        key="footer"
                                        textValue="Footer"
                                        style={{
                                            padding: "10px 0",
                                            display: "flex",
                                            backgroundColor: "transparent", // Không có màu nền khi hover
                                            cursor: "default", // Không thay đổi con trỏ chuột
                                        }}
                                        className="no-hover"
                                    >
                                        <div
                                            className="grid "
                                            style={{
                                                gridTemplateColumns: "1fr auto", // Chia 1 cột tự động co giãn và cột còn lại vừa đủ cho button
                                                //alignItems: "center", // Căn giữa theo trục dọc
                                                width: "100%", // Đảm bảo toàn bộ không gian dropdown
                                            }}
                                        >
                                            <span style={{ fontSize: "12px", alignContent: 'center', paddingLeft: '20px' }}  >
                                                {productsCart.reduce((total, cart) =>
                                                    total + cart.items.reduce((sum: any, item: any) => sum + item.quantity, 0), 0)} {" "}Sản phẩm
                                            </span>


                                            <Button
                                                color="danger"
                                                size="md"
                                                radius="sm"
                                                style={{
                                                    width: '160px'
                                                }}
                                            >
                                                <Link href="/shopping_cart"
                                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                                >
                                                    Xem Giỏ Hàng
                                                </Link>
                                            </Button>
                                        </div>
                                    </DropdownItem>
                                </>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </>
    );
};



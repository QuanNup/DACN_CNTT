'use client';
import { useShoppingCart } from "@/app/context/ShoppingCartContext";
import { sendRequest } from "@/utils/api";
import Icon, { ShopFilled, ShopOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, CheckboxGroup, Image, Input, Link, Modal, ModalContent, ModalFooter, ModalHeader, Popover, PopoverContent, PopoverTrigger, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ButtonDelete from "../ui/ButtonDelete";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/utils/format";

export const ChevronDownIcon = () => {
    return (
        <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                fill="currentColor"
            />
        </svg>
    );
};

export const InputQuantity = (props: any) => {
    const { item, session } = props
    const { fetchShoppingCart } = useShoppingCart()
    const [quantity, setQuantity] = useState<number | null>(item?.quantity)

    useEffect(() => {
        setQuantity(item.quantity); // Cập nhật state khi item thay đổi
    }, [item])

    const fetchUpdateToCart = async (itemId: any, productId: any, quantity: any, productPrice: any, variant: any) => {
        try {
            if (!productId || isNaN(quantity) || isNaN(productPrice)) {
                console.error("Invalid input data for updating cart");
                return;
            }
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/update-cart`, // Endpoint thêm vào giỏ hàng
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
                body: {
                    items: [
                        {
                            id: itemId,
                            product_id: productId,
                            quantity: quantity,
                            price: productPrice,
                            variant: variant
                        },
                    ],
                },
            });
            if (res.statusCode === 201) {
                fetchShoppingCart()
            } else {
                message.error("Không thể cập nhật giỏ hàng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
            message.error("Lỗi xảy ra khi cập nhật giỏ hàng!");
        }
    }

    return (
        <div className="flex items-center">
            {/* Nút Giảm */}
            <Button
                color="default"
                size="sm"
                isIconOnly
                onPress={() => {
                    let newQuantity = item.quantity - 1;

                    if (isNaN(newQuantity) || newQuantity < 1) {
                        message.error("Giá trị không thể nhỏ hơn!");
                        return;
                    }
                    fetchUpdateToCart(item.id, item.product_id, newQuantity, item.product.product_price, item.variant)
                    setQuantity(newQuantity)
                }
                }
                radius='none'
            >
                -
            </Button>

            <Input
                radius='none'
                //defaultValue={item.quantity}
                value={quantity !== null ? quantity.toString() : ""}
                onChange={(e) => {
                    const value = e.target.value.trim();
                    // If the value is empty, set to an empty string for direct deletion
                    if (value === "") {
                        setQuantity(null); // Allow empty input for deletion
                    } else {
                        const numericValue = parseInt(value, 10);
                        // Set the quantity only if it's a valid number and greater than or equal to 0
                        if (!isNaN(numericValue) && numericValue >= 0) {
                            setQuantity(numericValue);
                        }
                    }
                }}
                onBlur={() => {
                    // Reset to 1 if quantity is invalid
                    if (quantity === null || quantity < 1) {
                        setQuantity(1);
                        fetchUpdateToCart(item.id, item.product_id, 1, item.product.product_price, item.variant);
                    } else {
                        // Call fetchUpdateToCart when input loses focus
                        fetchUpdateToCart(item.id, item.product_id, quantity, item.product.product_price, item.variant);
                    }
                }}
                size="sm"
                className="w-12"
                variant="faded"
            />
            <Button
                color="default"
                size="sm" isIconOnly
                onPress={() => {
                    const newQuantity = item.quantity + 1;

                    if (isNaN(newQuantity) || newQuantity < 1) {
                        console.error("Invalid quantity:", newQuantity);
                        return;
                    }
                    setQuantity(newQuantity)
                    fetchUpdateToCart(item.id, item.product_id, newQuantity, item.product.product_price, item.variant)
                }
                }
                radius='none'
            >
                +
            </Button>
        </div>
    )
}
const HeaderCart = ({
    selectAll,
    handleSelectAll,
}: any) => {

    return (
        <div className="flex justify-center items-center">
            <div
                className=" mt-8 w-full max-w-[1400px]"
                style={{
                    position: "sticky",
                    zIndex: 1
                }}
            >
                <Card className="p-2 bg-default-100">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateAreas: `
                                "checkbox product price quantity totalprice func"
                                `,
                            gridTemplateColumns: "4% 40% 14% 14% 14% 14%", // Chia tỉ lệ: 30% hình ảnh, 55% thông tin, 15% giá
                            gap: "5px",
                            padding: "5px 8px",
                            overflow: "hidden",
                            height: '40px',
                        }}
                    >
                        <Checkbox
                            isSelected={selectAll}
                            onValueChange={handleSelectAll}
                            color="danger"
                            //className="custom-checkbox"
                            radius="sm"
                            style={{
                                gridArea: "checkbox",
                            }}
                        />
                        <div
                            style={{
                                gridArea: "product",
                                alignContent: 'center'
                            }}
                        >
                            <h1>Sản phẩm</h1>
                        </div>
                        <div
                            style={{
                                gridArea: "price",
                                alignContent: 'center',
                            }}
                        >
                            <h1>Đơn giá</h1>
                        </div>
                        <div
                            style={{
                                gridArea: "quantity",
                                alignContent: 'center',
                            }}
                        >
                            <h1>Số lượng</h1>
                        </div>
                        <div
                            style={{
                                gridArea: "totalprice",
                                alignContent: 'center',
                            }}
                        >
                            <h1>Số tiền</h1>
                        </div>
                        <div
                            style={{
                                gridArea: "func",
                                alignContent: 'center',
                                textAlign: "center",
                            }}
                        >
                            <h1>Thao tác</h1>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
const FooterCart = ({
    selectAll,
    handleSelectAll,
    totalPrice,
    totalProduct,
    handlePay,
    handleDeleteAll,
    handleDeleteItems,
    itemIds
}: any) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [activeModal, setActiveModal] = React.useState<string | null>(null)
    // Hàm mở modal theo key
    const openModal = (modalKey: string) => {
        setActiveModal(modalKey);
    }

    // Hàm đóng modal
    const closeModal = () => {
        setActiveModal(null);
    }

    return (
        <>
            <div className="flex justify-center items-center">
                <div
                    className="bg-default-100 bottom-0 py-6 w-full max-w-[1400px]"
                    style={{
                        height: 100,
                        position: "sticky",
                        zIndex: 1,
                        backdropFilter: "blur(20px)", // Làm mờ nội dung bên dưới
                        //backgroundColor: "rgba(255, 255, 255, 0.8)", // Nền mờ và có độ trong suốt
                        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateAreas: `
                        "checkbox delete deleteall totalprice pay"
                        `,
                            gridTemplateColumns: "15% 5% 15% 45% 20%", // Chia tỉ lệ: 30% hình ảnh, 55% thông tin, 15% giá
                            gap: "5px",
                            padding: "5px 16px",
                            overflow: "hidden",
                            height: '50px',
                        }}
                    >
                        <div
                            style={{
                                gridArea: 'checkbox',
                                alignContent: 'center',
                                textAlign: 'center',
                                display: 'flex',
                            }}
                        >
                            <Checkbox
                                isSelected={selectAll}
                                onValueChange={handleSelectAll}
                                radius="sm"
                                color="danger"
                            />
                            <h1 style={{ alignContent: 'center', }}>Chọn tất cả</h1>
                        </div>
                        <div
                            style={{
                                gridArea: 'delete',
                                alignContent: 'center',
                                cursor: 'pointer'
                                //textAlign: 'center'
                            }}
                            onClick={() => {
                                if (itemIds.length >= 1) {
                                    openModal('delete')
                                } else {
                                    message.error('Vui lòng chọn sản phẩm')
                                }
                            }}
                        >
                            <h1>Xóa</h1>
                        </div>
                        <div
                            style={{
                                gridArea: 'deleteall',
                                alignContent: 'center',
                                textAlign: 'center',

                            }}
                            //onClick={handleDeleteAll}
                            onClick={() => openModal('deleteall')}

                        >
                            <h1 style={{ cursor: 'pointer' }}>Xóa tất cả sản phẩm</h1>
                        </div>
                        <div
                            style={{
                                gridArea: 'totalprice',
                                alignContent: 'center',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',  // Căn giữa theo chiều dọc
                                justifyContent: 'end', // Căn giữa theo chiều ngang (nếu cần)
                                gap: '10px', // Khoảng cách giữa h1 và p
                            }}
                        >
                            <h1 style={{ margin: 0 }}>
                                Tổng thanh toán ({totalProduct} Sản phẩm):
                            </h1>
                            <p
                                style={{
                                    color: "#FF4500",
                                    fontSize: "20px",
                                    margin: 0, // Xóa margin mặc định
                                }}
                            >
                                {formatPrice(totalPrice)}
                            </p>
                        </div>

                        <div
                            style={{
                                gridArea: 'pay',
                                alignContent: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <Button className="w-40" radius="sm" color="danger" onClick={() => handlePay()}>Mua hàng</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={activeModal === 'deleteall'} onOpenChange={closeModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="p-10">Bạn có muốn bỏ tất cả sản phẩm</ModalHeader>
                            <ModalFooter>
                                <Button radius="sm" onPress={onClose}>Trở lại</Button>
                                <Button radius="sm" color="danger" onPress={onClose} onClick={handleDeleteAll}>Có</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal isOpen={activeModal === 'delete'} onOpenChange={closeModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="p-10">Bạn có muốn bỏ {itemIds.length} sản phẩm</ModalHeader>
                            <ModalFooter>
                                <Button radius="sm" onPress={onClose}>Trở lại</Button>
                                <Button radius="sm" color="danger" onPress={onClose} onClick={() => handleDeleteItems(itemIds)}>Có</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
const ProductCart = (props: any) => {
    const { session, productsCart } = props;
    const { fetchShoppingCart } = useShoppingCart();
    const [selectedIndices, setSelectedIndices] = useState<{ [key: string]: string | null }>({});
    const [openPopover, setOpenPopover] = useState<{ [key: string]: boolean }>({});
    const router = useRouter();
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ [storeId: string]: { [id: string]: boolean } }>({});
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [totalProduct, setTotalProduct] = useState<number>(0)
    const [itemIds, setItemIds] = useState<string[]>([]);
    const [orderId, serOrderId] = useState<string>()

    useEffect(() => {
        // Kiểm tra nếu groupedByStore có giá trị hợp lệ trước khi sử dụng
        if (productsCart && productsCart.length > 0) {
            const initialSelectedItems: { [storeId: string]: { [id: string]: boolean } } = {};
            productsCart.forEach((group: any) => {
                initialSelectedItems[group.store_id] = {};
                group.items.forEach((item: any) => {
                    initialSelectedItems[group.store_id][item.id] = false; // Mặc định là chưa chọn
                });
            });
            setSelectedItems(initialSelectedItems);
        }
    }, [productsCart])

    const handleSelectAll = (isSelected: boolean) => {
        // Cập nhật trạng thái chọn tất cả (selectAll)
        setSelectAll(isSelected);

        // Kiểm tra nếu trạng thái chưa thay đổi thì không làm gì
        if (selectAll === isSelected) return;

        // Khởi tạo newSelectedItems cho tất cả các cửa hàng
        const newSelectedItems: { [storeId: string]: { [id: string]: boolean } } = {};
        groupedByStore.forEach((group: any) => {
            // Tạo đối tượng mới cho cửa hàng, mặc định tất cả sản phẩm đều được chọn theo isSelected
            newSelectedItems[group.store_id] = {};

            group.items.forEach((item: any) => {
                newSelectedItems[group.store_id][item.id] = isSelected;

            });
        });

        // Cập nhật trạng thái selectedItems với giá trị mới
        setSelectedItems(newSelectedItems);
        let totalProduct = 0
        let itemIds: string[] = [];
        // Tính tổng tiền nếu tất cả sản phẩm được chọn
        if (isSelected) {
            const total = groupedByStore.reduce((acc: number, group: any) => {
                group.items.forEach((item: any) => {
                    acc += item.price * item.quantity; // Tính tổng tiền cho các sản phẩm
                    totalProduct += item.quantity
                    itemIds.push(item);
                });
                return acc;
            }, 0);
            setItemIds(itemIds);
            setTotalProduct(totalProduct)
            setTotalPrice(total); // Cập nhật tổng tiền
        } else {
            setItemIds([]);
            setTotalProduct(0)
            setTotalPrice(0); // Nếu bỏ chọn tất cả thì tổng tiền = 0
        }
    }

    const handleSelectAllStoreItems = (storeId: string, isSelected: boolean) => {
        setSelectedItems((prev) => {
            const newSelection = {
                ...prev,
                [storeId]: {
                    ...prev[storeId],
                },
            };

            // Khởi tạo lại tổng tiền
            let total = 0;
            let totalProduct = 0
            let itemIds: string[] = []
            groupedByStore.forEach((group: any) => {
                if (group.store_id === storeId) {
                    group.items.forEach((item: any) => {
                        newSelection[storeId][item.id] = isSelected; // Cập nhật trạng thái cho sản phẩm trong cửa hàng
                        if (isSelected) {
                            total += item.price * item.quantity; // Cộng tiền nếu sản phẩm được chọn
                            totalProduct += item.quantity
                            itemIds.push(item);
                        }
                    });
                }
            });

            // Cập nhật lại tổng tiền cho cửa hàng (với tổng tiền đã tính lại)
            setTotalPrice(total); // Cập nhật tổng tiền của cửa hàng (không cộng dồn với tổng cũ)
            setTotalProduct(totalProduct)
            setItemIds(itemIds)
            // Kiểm tra xem tất cả sản phẩm trong cửa hàng có được chọn không
            const allSelected = Object.values(newSelection[storeId]).every(Boolean);

            // Cập nhật trạng thái checkbox "Chọn tất cả"
            setSelectAll(Object.values(newSelection).every(store => Object.values(store).every(Boolean)));

            return newSelection;
        });
    }

    const handleItemChange = (storeId: string, itemId: string) => {
        setSelectedItems((prev) => {
            // Lấy đối tượng sản phẩm của cửa hàng hoặc khởi tạo rỗng nếu chưa có
            const storeItems = prev[storeId] || {};

            // Đảo trạng thái của sản phẩm dựa trên itemId
            const newStoreItems = {
                ...storeItems,
                [itemId]: !storeItems[itemId], // Đảo trạng thái của sản phẩm
            };

            // Tạo đối tượng mới cho selectedItems với cửa hàng và sản phẩm đã cập nhật
            const newSelection = {
                ...prev,
                [storeId]: newStoreItems,
            };

            // Kiểm tra xem tất cả sản phẩm trong cửa hàng đã được chọn hay chưa
            const allSelectedInStore = Object.values(newStoreItems).every(Boolean);

            // Kiểm tra nếu tất cả sản phẩm của tất cả cửa hàng đều được chọn
            const allSelected = Object.values(newSelection).every(store =>
                Object.values(store).every(Boolean)
            );

            // Cập nhật trạng thái selectAll chỉ khi cần thiết (nếu trạng thái có thay đổi)
            if (selectAll !== allSelected) {
                setSelectAll(allSelected);
            }

            // Tính lại tổng tiền
            let total = 0;
            let totalProduct = 0
            let itemIds: string[] = []
            groupedByStore.forEach((group: any) => {
                group.items.forEach((item: any) => {
                    // Kiểm tra nếu sản phẩm được chọn
                    if (newSelection[group.store_id] && newSelection[group.store_id][item.id]) {
                        total += item.price * item.quantity; // Cộng tiền cho sản phẩm đã chọn
                        totalProduct += item.quantity
                        itemIds.push(item);
                    }
                });
            });

            // Cập nhật lại tổng tiền
            setTotalPrice(total);
            setTotalProduct(totalProduct)
            setItemIds(itemIds)
            return newSelection;
        });
    }

    const handleSuggestionClick = (link: string, type: string) => {
        if (type === 'product') {
            router.push(`/product_detail/${link}`);
        } else if (type === 'category') {
            router.push(`/category_detail/${link}`);
        } else if (type === 'store') {
            router.push(`/store/${link}`);
        }
    }

    const groupedByStore = Object.values(
        productsCart.reduce((acc: any, cart: any) => {
            cart.items.forEach((item: any) => {
                const storeName = item.store?.store_name; // Lấy store_id từ product trong item
                const storeId = item.store?.store_id
                if (!storeId || !storeName) return; // Bỏ qua nếu store_id không tồn tại

                // Tạo một nhóm theo store_id nếu chưa có
                if (!acc[storeId]) {
                    acc[storeId] = {
                        store_id: storeId,
                        store_name: storeName,
                        items: [],
                    };
                }

                // Thêm item vào nhóm tương ứng
                acc[storeId].items.push(item);
            });
            return acc;
        }, {})
    )

    const handleSelectVariant = (itemId: string, variant: string) => {
        setSelectedIndices(prev => ({
            ...prev,
            [itemId]: variant,
        }));
    }

    const handlePopoverOpenChange = (isOpen: boolean, itemId: string) => {
        setOpenPopover(prev => ({ ...prev, [itemId]: isOpen }));

        if (isOpen) {
            // Reset về biến thể đầu tiên khi mở Popover
            const defaultVariant = productsCart
                .flatMap((group: any) => group.items) // Lấy tất cả các item từ tất cả các group
                .find((item: any) => item.id === itemId)?.variant || null; // Lấy biến thể đầu tiên hoặc null nếu không có
            setSelectedIndices(prev => ({
                ...prev,
                [itemId]: defaultVariant,

            }));
        }
    }

    const fetchUpdateToCart = async (itemId: any, productId: any, quantity: any, productPrice: any, variant: any) => {
        try {
            if (!productId || isNaN(quantity) || isNaN(productPrice)) {
                console.error("Invalid input data for updating cart");
                return;
            }
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/update-cart`, // Endpoint thêm vào giỏ hàng
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
                body: {
                    items: [
                        {
                            id: itemId,
                            product_id: productId,
                            quantity: quantity,
                            price: productPrice,
                            variant: variant
                        },
                    ],
                },
            });
            if (res.statusCode === 201) {
                fetchShoppingCart()
            } else {
                message.error("Không thể cập nhật giỏ hàng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
            message.error("Lỗi xảy ra khi cập nhật giỏ hàng!");
        }
    }

    const fetchDeleteCart = async (itemIds: string[]) => {
        try {
            const items = itemIds.map(({ id }: any) => ({ item_id: id }));
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/delete-cart-item`, // Endpoint thêm vào giỏ hàng
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
                body: { items },
            });
            if (res.data) {
                fetchShoppingCart()
            } else {
                message.error("Không thể xóa giỏ hàng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            message.error("Lỗi xảy ra khi xóa sản phẩm!");
        }
    }

    const handleDeleteAll = () => {
        const itemIds = productsCart.flatMap((group: any) =>
            group.items.map((item: any) => item) // Lấy tất cả item.id
        );
        fetchDeleteCart(itemIds);
    }

    const handleDeleteItems = (items: string[]) => {
        fetchDeleteCart(items)
    }

    const fetchOrder = async (items: string[]) => {
        try {
            const filteredData = items.map((item: any) => ({
                cartItemId: item.id,
                productId: item.product_id,
                productName: item.product.product_name,
                price: item.price,
                quantity: item.quantity,
                variant: item.variant || ''
            }));
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/create-order`, // Endpoint thêm vào giỏ hàng
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
                body: {
                    items: filteredData,
                    totalAmount: totalPrice,
                    details: {
                        cardNumber: '4111111111111111',
                        expiryDate: '12/28',
                        cardHolder: 'Quân Nguyễn',
                        securityCode: '271'
                    }
                },
            });
            if (res.statusCode === 201) {
                await fetchDeleteCart(items)
                await serOrderId(res.data.orderId)
                await fetchShoppingCart()
                message.success('Đơn hàng đã được tạo thành công!');
            } else {
                message.error("Không thể tạo đơn hàng. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error);
            message.error("Lỗi xảy ra khi tạo đơn hàng!");
        }
    }

    const handlePay = async () => {
        if (!totalPrice || !itemIds) {
            message.error('Lỗi thông tin không hợp lệ!')
            return;
        }
        localStorage.setItem('amount', JSON.stringify(totalPrice));
        try {
            await fetchOrder(itemIds);
            localStorage.setItem('orderId', JSON.stringify(orderId));
            router.push('/payment');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xử lý đơn hàng!');
            console.error(error);
        }
    }

    return (
        <>
            {productsCart.length > 0 ? (
                <>
                    <HeaderCart
                        selectAll={selectAll}
                        handleSelectAll={handleSelectAll}
                    />
                    <div className="flex justify-center items-center">
                        <div className="w-full h-full max-w-[1400px] mt-3"
                            style={{
                                maxHeight: '100%', overflowY: 'auto', scrollbarWidth: 'none',
                            }}
                        >
                            {groupedByStore.map((group: any) => (
                                <Card className="p-2 bg-default-100 mb-4" key={group.store_id}>
                                    <div
                                        className="border-b"
                                        style={{
                                            display: "grid",
                                            gridTemplateAreas: `
                                "checkbox storeicon store"
                                `,
                                            gridTemplateColumns: "4% 4% 92%", // Chia tỉ lệ: 30% hình ảnh, 55% thông tin, 15% giá
                                            //alignItems: "center",
                                            gap: "5px",
                                            padding: "5px 8px",
                                            overflow: "hidden",
                                            height: '40px',
                                        }}
                                    >
                                        <Checkbox
                                            isSelected={
                                                // Kiểm tra nếu có ít nhất một sản phẩm được chọn trong cửa hàng
                                                Object.values(selectedItems[group.store_id] || {}).length > 0 &&
                                                Object.values(selectedItems[group.store_id] || {}).every(value => value === true)
                                            }
                                            onChange={() => handleSelectAllStoreItems(group.store_id, !Object.values(selectedItems[group.store_id] || {}).every(Boolean))}
                                            color="danger"
                                            //className="custom-checkbox"
                                            radius="sm"
                                            style={{
                                                gridArea: "checkbox",
                                            }}
                                        />
                                        <div style={{
                                            gridArea: "storeicon",
                                            alignContent: 'center'
                                        }}>
                                            <ShopOutlined />
                                        </div>
                                        <div
                                            style={{
                                                gridArea: "store",
                                                alignContent: 'center',
                                            }}
                                        >
                                            <Link href={`store/${group.store_id}`} color="foreground">
                                                {group.store_name}
                                            </Link>
                                        </div>
                                    </div>
                                    {group.items.map((item: any) => (
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateAreas: `
                                                "checkbox product price quantity totalprice func"
                                                `,
                                                gridTemplateColumns: "4% 40% 14% 14% 14% 14%", // Chia tỉ lệ: 30% hình ảnh, 55% thông tin, 15% giá
                                                //alignItems: "center",
                                                gap: "5px",
                                                padding: "5px 8px",
                                                height: '120px',
                                            }}
                                            key={`${item.product_id}-${item.variant}`}
                                        >
                                            <Checkbox
                                                isSelected={!!selectedItems[group.store_id]?.[item.id]} // Kiểm tra trạng thái chọn của sản phẩm
                                                onChange={() => {
                                                    handleItemChange(group.store_id, item.id)
                                                    //setTotalPrice(item.price + item.quantity)
                                                }} // Cập nhật trạng thái cho sản phẩm
                                                color="danger"
                                                //className="custom-checkbox"
                                                radius="sm"
                                                style={{
                                                    gridArea: "checkbox",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    gridArea: "product",
                                                    alignContent: 'center'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateAreas: `
                                                "image info category"
                                                `,
                                                        gridTemplateColumns: "20% 40% 40%", // Chia tỉ lệ: 30% hình ảnh, 55% thông tin, 15% giá
                                                        //alignItems: "center",
                                                        padding: "8px 10px",
                                                    }}
                                                >
                                                    {/* Hình ảnh sản phẩm */}
                                                    <Image
                                                        isBlurred
                                                        src={item.product?.images?.find((img: any) => img.variants === item.variant)?.url}
                                                        alt={item.product?.product_name}
                                                        height={80}
                                                        width={80}
                                                        style={{
                                                            borderRadius: "8px",
                                                            objectFit: "cover",
                                                            width: "100%",
                                                            height: "auto",
                                                            gridArea: "image",
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleSuggestionClick(item.product?.product_id, 'product')}
                                                    />
                                                    {/* Thông tin sản phẩm */}
                                                    <div
                                                        style={{
                                                            gridArea: "info",
                                                            marginLeft: '10px',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleSuggestionClick(item.product?.product_id, 'product')}
                                                    >
                                                        <p
                                                            className="text-ellipsis overflow-hidden line-clamp-2"
                                                            style={{
                                                                margin: 0,
                                                                fontSize: "14px",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            {item.product?.product_name || "Tên sản phẩm"}
                                                        </p>

                                                    </div>
                                                    <div
                                                        style={{
                                                            gridArea: "category",
                                                            alignContent: 'center'
                                                        }}
                                                        key={`${item.variant}`}
                                                    >
                                                        <Popover
                                                            showArrow
                                                            offset={20}
                                                            placement="bottom"
                                                            key={item.id}
                                                            onOpenChange={(isOpen) => handlePopoverOpenChange(isOpen, item.id)}
                                                        >
                                                            <PopoverTrigger>
                                                                <div>
                                                                    <p
                                                                        className="text-ellipsis overflow-hidden "
                                                                        style={{
                                                                            margin: 0,
                                                                            fontSize: "15px",
                                                                            color: "#666",
                                                                            cursor: 'pointer',
                                                                            width: '100%',
                                                                            display: 'inline-flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px',
                                                                        }}
                                                                    >
                                                                        Phân loại hàng:<ChevronDownIcon />
                                                                    </p>
                                                                    <p
                                                                        className="text-ellipsis overflow-hidden line-clamp-2"
                                                                        style={{
                                                                            margin: 0,
                                                                            fontSize: "15px",
                                                                            color: "#666",
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        {item.variant}
                                                                    </p>
                                                                </div>
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <div className="px-3 py-3 w-96">
                                                                    <div className="flex flex-wrap gap-4 w-full mb-10">
                                                                        <div className="text-small font-bold content-center">Phân loại:</div>
                                                                        {item.product?.images?.map((img: any, index: number) => (
                                                                            //<SelectButtonVariant index={index} img={img} item={item} session={session} />
                                                                            <Button
                                                                                key={index}
                                                                                onClick={() => handleSelectVariant(item.id, img.variants)}
                                                                                radius="sm"
                                                                                //onClick={() => handleClick(index)}
                                                                                color={selectedIndices[item.id] === img.variants ? 'danger' : 'default'}
                                                                                style={{
                                                                                    transition: "all 0.3s ease", // Hiệu ứng mượt
                                                                                }}
                                                                                variant={selectedIndices[item.id] === img.variants ? "bordered" : 'flat'}
                                                                            >
                                                                                {img.variants}
                                                                            </Button>
                                                                        ))}
                                                                    </div>
                                                                    <div style={{ textAlign: "right" }}>
                                                                        <Button
                                                                            radius="sm"
                                                                            className="w-40"
                                                                            color="danger"
                                                                            onClick={() => {
                                                                                fetchUpdateToCart(item.id, item.product_id, item.quantity, item.product.product_price, selectedIndices[item.id]);
                                                                            }}
                                                                        >
                                                                            Xác nhận
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    gridArea: "price",
                                                    alignContent: 'center'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        margin: 0,
                                                        fontSize: "15px",
                                                        color: "#666",
                                                    }}
                                                >
                                                    {formatPrice(item.product?.product_price || '0')}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    gridArea: "quantity",
                                                    alignContent: 'center',
                                                    textAlign: "center"
                                                }}
                                            >
                                                <InputQuantity session={session} item={item} />
                                            </div>
                                            <div
                                                style={{
                                                    gridArea: "totalprice",
                                                    alignContent: 'center',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#FF4500",
                                                        fontSize: "15px",
                                                    }}
                                                >
                                                    {formatPrice((item.product?.product_price || '0') * (item.quantity || 1))}
                                                </span>


                                            </div>
                                            <div
                                                style={{
                                                    gridArea: "func",
                                                    alignContent: "center",
                                                    cursor: "pointer",
                                                    alignItems: "center", // Xóa thuộc tính này (không có tác dụng ở đây)
                                                    display: "flex", // Kích hoạt Flexbox
                                                    justifyContent: "center", // Căn giữa theo chiều ngang
                                                }}
                                                onClick={() => fetchDeleteCart([item])}
                                            >
                                                <ButtonDelete />
                                            </div>
                                        </div>
                                    ))}
                                </Card>
                            ))}
                        </div>
                    </div>
                    <FooterCart
                        selectAll={selectAll}
                        handleSelectAll={handleSelectAll}
                        totalPrice={totalPrice}
                        totalProduct={totalProduct}
                        handlePay={handlePay}
                        handleDeleteAll={handleDeleteAll}
                        handleDeleteItems={handleDeleteItems}
                        itemIds={itemIds}
                    />
                </>
            ) : (
                <div className="content-center h-full text-center">
                    <span>
                        Giỏ hàng trống
                    </span>
                </div>
            )}
        </>
    )
}

export default function ShoppingCart() {
    const { data: session, status } = useSession();
    const { productsCart, fetchShoppingCart } = useShoppingCart();
    return (
        <>
            <ProductCart session={session} productsCart={productsCart} />
        </>
    )
}
"use client";
import React, { useEffect, useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/library/convertToSubcurrency";
import { Button, Card } from "@nextui-org/react";
import { message } from "antd";
import { useShoppingCart } from "@/app/context/ShoppingCartContext";
import { sendRequest } from "@/utils/api";
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(price);
};
function convertVNDToUSD(vndAmount: number): number {
    const exchangeRate = 24000; // Tỷ giá 1 USD = 24,000 VND (cập nhật tỷ giá thực tế khi cần)
    const usdAmount = vndAmount / exchangeRate;
    return parseFloat(usdAmount.toFixed(2)); // Làm tròn đến 2 chữ số sau dấu thập phân
}
const CheckoutPage = ({ totalPrice, session, orderId }: { totalPrice: number, session: any, orderId: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const { fetchShoppingCart } = useShoppingCart();
    const amount = convertVNDToUSD(totalPrice)
    useEffect(() => {
        console.log(amount, orderId)
    })
    // const fetchDeleteCart = async (itemIds: string[]): Promise<void> => {
    //     const items = itemIds.map((id) => ({ item_id: id }));
    //     try {
    //         const res = await sendRequest<IBackendRes<any>>({
    //             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopping-cart/delete-cart-item`, // Endpoint thêm vào giỏ hàng
    //             method: "DELETE",
    //             headers: {
    //                 Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
    //             },
    //             body: { items }
    //         });
    //         if (res.data) {
    //             fetchShoppingCart()
    //         } else {
    //             throw new Error("Không thể cập nhật giỏ hàng. Vui lòng thử lại!");
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi cập nhật giỏ hàng:", error);
    //         throw new Error("Lỗi xảy ra khi thanh toán và cập nhật giỏ hàng!");
    //     }
    // };

    const fetchSuccessOrder = async (orderId: string) => {
        try {
            const res = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/update-order`, // Endpoint thêm vào giỏ hàng
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`, // Đảm bảo người dùng đã đăng nhập
                },
                body: {
                    orderId: orderId,
                    status: 'SUCCESS'
                },
            });
            if (res.statusCode === 201) {
                message.success("Đã thanh toán thành công!");
            } else {
                message.error("Không thể thanh toán. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            message.error("Lỗi xảy ra khi thanh toán!");
        }
    }
    useEffect(() => {
        if (amount <= 0) {
            message.error("Số tiền không hợp lệ!");
            return;
        }

        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch(() => message.error("Không thể tạo yêu cầu thanh toán."));
    }, [amount]);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://localhost:3000/payment/payment-success?amount=${amount}`,
            },
        });

        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            setErrorMessage(error.message);
        } else {
            // The payment UI automatically closes with a success animation.
            // Your customer is redirected to your `return_url`.
        }

        setLoading(false);
    };




    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-2 rounded-md">
            {clientSecret && <PaymentElement />}

            {errorMessage && <div>{errorMessage}</div>}

            <button
                disabled={!stripe || loading}
                className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            >
                {loading ? "Đang xử lý..." : `Thanh toán ${formatPrice(totalPrice)}`}
            </button>
        </form>
    );
};

export default CheckoutPage;

import { OrderProvider, useOrder } from "@/app/context/OrderContext";
import History from "@/components/pages/page.history";
import { Metadata } from "next";
import { useEffect } from "react";

export const metadata: Metadata = {
    title: "Lịch sử mua hàng",
};
export default function HistoryPage() {

    return (
        <>
            <OrderProvider >
                <History />
            </OrderProvider>
        </>
    )
}
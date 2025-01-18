"use client";
import { auth } from "@/auth";
import convertToSubcurrency from "@/library/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import CheckoutPage from "./components/CheckoutPage";
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
function convertVNDToUSD(vndAmount: number): number {
    const exchangeRate = 24000; // Tỷ giá 1 USD = 24,000 VND (cập nhật tỷ giá thực tế khi cần)
    const usdAmount = vndAmount / exchangeRate;
    return parseFloat(usdAmount.toFixed(2)); // Làm tròn đến 2 chữ số sau dấu thập phân
}
export default function Payment() {
    const { data: session, status } = useSession();
    const totalPrice = JSON.parse(localStorage.getItem("amount") || "1000000");
    const orderId = JSON.parse(localStorage.getItem("orderId") || "[]");
    const amount = convertVNDToUSD(totalPrice)
    useEffect(() => {
        console.log(orderId)
        console.log(totalPrice)
    })
    return (
        <main className="max-w-6xl p-10 px-40 pt-10 mt-20 mx-20 text-center rounded-md">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold mb-2">Paypal</h1>
            </div>
            <Elements
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    amount: convertToSubcurrency(Number(amount)),
                    currency: "usd",
                }}
            >
                <CheckoutPage totalPrice={Number(totalPrice)} session={session} orderId={orderId} />
            </Elements>
        </main>
    );
}
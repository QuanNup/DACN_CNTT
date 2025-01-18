import ShoppingCart from "@/components/pages/page.shopping_cart"
import { auth } from "@/auth"
import { Card } from "@nextui-org/card"
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Giỏ hàng",
};
const ShoppingCartPage = () => {
    return (
        <Card className="h-screen">
            <ShoppingCart />
        </Card>

    )
}
export default ShoppingCartPage
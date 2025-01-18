
import ProductDetail from "@/components/pages/page.product_detail";
import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import React from "react";
import { CartProvider } from "@/app/context/CartContext";

export async function generateMetadata({ params }: { params: { product_id: string } }) {
    const { product_id } = params;
    try {
        const product = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/product-detail/${product_id}`,
            method: "GET",
        })
        if (!product) {
            return {
                title: "Sản phẩm không tồn tại",
                description: "Sản phẩm không tìm thấy",
            };
        }
        return {
            title: product.data.product_name,
            description: `Thông tin chi tiết về sản phẩm ${product.data.product_name}`,
        }
    } catch (error) {
        console.error("Failed to call api: ", error);
    }
};
const ProductDetailPage = ({ params }: { params: { product_id: string } }) => {
    const { product_id } = params

    return (
        <>
            <div className="container mx-auto p-4">
                <ProductDetail product_id={product_id} />
            </div>
        </>
    )
}
export default ProductDetailPage
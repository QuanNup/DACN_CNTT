"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton, Image, Button } from "@nextui-org/react";
import { Layout, Row, Col } from "antd";

const AppContentUser = () => {
    const { Content } = Layout;
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Giả lập API call để lấy danh sách sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/products"); // Thay đường dẫn API của bạn
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Content style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách sản phẩm</h1>
            <Row gutter={[16, 16]}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Col span={6} key={index}>
                            <Card className="w-full space-y-5 p-4" radius="lg">
                                <Skeleton className="rounded-lg">
                                    <div className="h-40 rounded-lg bg-default-300" />
                                </Skeleton>
                                <div className="space-y-3">
                                    <Skeleton className="w-3/5 rounded-lg">
                                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                                    </Skeleton>
                                    <Skeleton className="w-4/5 rounded-lg">
                                        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                                    </Skeleton>
                                    <Skeleton className="w-2/5 rounded-lg">
                                        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                                    </Skeleton>
                                </div>
                            </Card>
                        </Col>
                    ))
                    : products.map((product) => (
                        <Col span={6} key={product.id}>
                            <Card className="w-full space-y-4 p-4" radius="lg" shadow="md">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    height={160}
                                    //objectFit="cover"
                                    className="rounded-lg"
                                />
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-sm text-default-500">
                                    {product.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary-500 font-semibold">
                                        {product.price.toLocaleString()} đ
                                    </span>
                                    <Button size="sm" color="primary">
                                        Mua ngay
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
            </Row>
        </Content>
    );
};

export default AppContentUser;

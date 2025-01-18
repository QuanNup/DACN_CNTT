'use client'
import { Col, Row } from "antd"
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { MdPeople, MdShoppingBag, MdSupervisedUserCircle, MdAnalytics, MdAttachMoney, MdOutlineSettings, MdHelpCenter, MdShoppingCart } from 'react-icons/md';
import { useState } from "react";

const cardItems = [
    {
        icon: <MdSupervisedUserCircle className="h-10 w-10 text-blue-500 mb-2" />,
        title: "Quản lý cửa hàng",
        description: "Quản lý và xét duyệt các cửa hàng trên hệ thống."
    },
    {
        icon: <MdPeople className="h-10 w-10 text-green-500 mb-2" />,
        title: "Quản lý người dùng",
        description: "Quản lý thông tin và hoạt động của người dùng trên hệ thống."
    },
    {
        icon: <MdShoppingCart className="h-10 w-10 text-orange-500 mb-2" />,
        title: "Quản lý đơn hàng",
        description: "Quản lý các đơn hàng được đặt trên hệ thống."
    },
    {
        icon: <MdShoppingBag className="h-10 w-10 text-red-500 mb-2" />,
        title: "Quản lý sản phẩm",
        description: "Quản lý các sản phẩm được đăng bán bởi các cửa hàng."
    },
    // Add more card items here
];

const Cards = () => {

    const [filter, setFilter] = useState('');

    const filteredItems = cardItems.filter(item => item.title.includes(filter));
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cardItems.map((item) => (
                <div className="flex">
                    <Card
                        className='p-5 rounded-lg flex gap-5 cursor-pointer w-full bg-gradient-to-br from-white to-gray-300 dark:from-[#182237] dark:to-[#253352] 
      hover:shadow-lg hover:bg-gradient-to-tr hover:from-white hover:to-gray-400 
      dark:hover:from-[#253352] dark:hover:to-[#2e374a]'
                    >
                        <CardHeader>
                            {item.icon}
                            <h2 className="font-bold">{item.title}</h2>
                        </CardHeader>
                        <CardBody>
                            <p>{item.description}</p>
                        </CardBody>
                    </Card>
                </div>
            ))}
        </div>
    )
}
export default Cards
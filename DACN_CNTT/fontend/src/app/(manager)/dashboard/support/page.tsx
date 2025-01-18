'use client'

import { useState } from 'react';
import { Card, Accordion, AccordionItem, Input, Textarea, Button } from "@nextui-org/react";

const faqs = [
    {
        question: "Làm thế nào để tôi thêm sản phẩm mới?",
        answer: "Để thêm sản phẩm mới, hãy đi đến trang 'Sản phẩm' từ menu bên trái, sau đó nhấn vào nút 'Thêm sản phẩm mới'. Điền đầy đủ thông tin sản phẩm và nhấn 'Lưu'."
    },
    {
        question: "Làm cách nào để xem báo cáo doanh thu?",
        answer: "Báo cáo doanh thu có thể được xem trên trang 'Tổng quan'. Bạn sẽ thấy biểu đồ doanh thu và có thể lọc theo ngày, tuần hoặc tháng."
    },
    {
        question: "Tôi có thể quản lý tồn kho như thế nào?",
        answer: "Quản lý tồn kho được thực hiện trong phần 'Kho hàng'. Tại đây, bạn có thể xem số lượng tồn kho hiện tại, cập nhật số lượng và thiết lập cảnh báo khi hàng sắp hết."
    },
    {
        question: "Làm thế nào để xử lý đơn hàng hoàn trả?",
        answer: "Để xử lý đơn hàng hoàn trả, hãy vào phần 'Đơn hàng', tìm đơn hàng cần xử lý và chọn tùy chọn 'Hoàn trả'. Sau đó, làm theo các bước hướng dẫn để hoàn tất quá trình."
    },
    {
        question: "Tôi có thể tùy chỉnh giao diện của cửa hàng trực tuyến không?",
        answer: "Có, bạn có thể tùy chỉnh giao diện cửa hàng trực tuyến. Vào phần 'Cài đặt' và chọn 'Tùy chỉnh giao diện'. Tại đây, bạn có thể thay đổi màu sắc, font chữ và bố cục của cửa hàng."
    }
];

export default function SupportPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Yêu cầu hỗ trợ đã được gửi! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.");
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="px-4 py-8"
            style={{
                maxHeight: '100%', overflowY: 'auto', scrollbarWidth: 'none',
            }}
        >
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-center">Hỗ trợ khách hàng</h1>
                <Card className="mx-auto w-[80%] lg:w-[60%] dark:bg-[#44475a] bg-gradient-to-t from-white to-gray-300  shadow-lg dark:bg-none">
                    <div className="py-4 pl-6">
                        <h3 className="font-bold text-2xl">Câu hỏi thường gặp</h3>
                        <p className="text-sm text-gray-400">Những câu hỏi phổ biến về việc sử dụng hệ thống quản lý cửa hàng</p>
                    </div>
                    <div className="p-4">
                        <Accordion>
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} title={faq.question}>
                                    <p>{faq.answer}</p>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </Card>

                <Card className="mx-auto w-[80%] lg:w-[60%] dark:bg-[#44475a] bg-gradient-to-t from-white to-gray-300  shadow-lg dark:bg-none">
                    <div className="py-4 pl-6">
                        <h3 className="font-bold text-2xl">Liên hệ hỗ trợ</h3>
                        <p className="text-sm text-gray-400">Gửi yêu cầu hỗ trợ cho đội ngũ kỹ thuật của chúng tôi</p>
                    </div>
                    <div className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Họ và tên</label>
                                <Input
                                    placeholder='Nhập Họ & Tên'
                                    variant='underlined'
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    radius='sm'
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                                <Input
                                    placeholder='Nhập Email'
                                    variant='underlined'
                                    id="email"
                                    type="email"
                                    value={email}
                                    radius='sm'
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400">Nội dung yêu cầu</label>
                                <Textarea
                                    variant='underlined'
                                    placeholder='Nhập nội dung yêu cầu...'
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    radius='sm'
                                />
                            </div>
                            <Button type="submit" radius='sm' className='bg-gradient-to-br from-white to-gray-700 text-white dark:bg-none dark:bg-purple-600'>Gửi yêu cầu</Button>
                        </form>
                    </div>
                </Card>

                <Card className="mx-auto w-[80%] lg:w-[60%] dark:bg-[#44475a] bg-gradient-to-t from-white to-gray-300 shadow-lg dark:bg-none">
                    <div className="py-4 pl-6">
                        <h3 className="font-bold text-2xl">Thông tin liên hệ</h3>
                        <p className="text-sm text-gray-400">Các cách khác để liên hệ với chúng tôi</p>
                    </div>
                    <div className="p-4">
                        <p><strong>Email:</strong> quan369852@gmail.com</p>
                        <p><strong>Điện thoại:</strong>(+84) 822 652 925</p>
                        <p><strong>Địa chỉ:</strong> 80 Đường số 49, Tân Quy, Quận 7, TP. Hồ Chí Minh</p>
                        <p><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

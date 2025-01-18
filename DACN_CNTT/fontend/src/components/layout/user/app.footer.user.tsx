'use client'

import React from 'react';
import { CreditCard, Facebook, Instagram, Twitter, Youtube, ShoppingCartIcon as Paypal } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Thông tin công ty */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
                        <p className="mb-4">QQ E-commerce - Nơi mua sắm trực tuyến đáng tin cậy cho mọi nhu cầu của bạn.</p>
                        <p>© 2023 QQ E-commerce. Tất cả quyền được bảo lưu.</p>
                    </div>

                    {/* Danh mục sản phẩm */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gray-900">Điện thoại & Máy tính bảng</a></li>
                            <li><a href="#" className="hover:text-gray-900">Laptop & Máy tính</a></li>
                            <li><a href="#" className="hover:text-gray-900">Thời trang & Phụ kiện</a></li>
                            <li><a href="#" className="hover:text-gray-900">Nhà cửa & Đời sống</a></li>
                            <li><a href="#" className="hover:text-gray-900">Sách & Văn phòng phẩm</a></li>
                        </ul>
                    </div>

                    {/* Hỗ trợ khách hàng */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gray-900">Trung tâm trợ giúp</a></li>
                            <li><a href="#" className="hover:text-gray-900">Chính sách đổi trả</a></li>
                            <li><a href="#" className="hover:text-gray-900">Chính sách bảo hành</a></li>
                            <li><a href="#" className="hover:text-gray-900">Phương thức vận chuyển</a></li>
                            <li><a href="#" className="hover:text-gray-900">Phương thức thanh toán</a></li>
                        </ul>
                    </div>

                    {/* Liên hệ và mạng xã hội */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h3>
                        <p className="mb-2">Hotline: 1900 9999</p>
                        <p className="mb-4">Email: hotro@qqe-commerce.com</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-gray-900">
                                <Facebook size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-900">
                                <Instagram size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-900">
                                <Twitter size={24} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-900">
                                <Youtube size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Chứng nhận và thanh toán */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="w-full md:w-1/2 mb-4 md:mb-0">
                            <h4 className="text-sm font-semibold mb-2">Chứng nhận</h4>
                            <div className="flex space-x-4">
                                {/* <img src="/placeholder.svg?height=40&width=40" alt="Chứng nhận 1" className="h-10" />
                                <img src="/placeholder.svg?height=40&width=40" alt="Chứng nhận 2" className="h-10" />
                                <img src="/placeholder.svg?height=40&width=40" alt="Chứng nhận 3" className="h-10" /> */}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h4 className="text-sm font-semibold mb-2">Phương thức thanh toán</h4>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center">
                                    <CreditCard className="w-8 h-8 mr-2" />
                                    <span>Visa/Mastercard</span>
                                </div>
                                <div className="flex items-center">
                                    <Paypal className="w-8 h-8 mr-2" />
                                    <span>PayPal</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 mr-2 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">M</span>
                                    <span>Momo</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 mr-2 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">Z</span>
                                    <span>ZaloPay</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-8 h-8 mr-2 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">V</span>
                                    <span>VNPay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;



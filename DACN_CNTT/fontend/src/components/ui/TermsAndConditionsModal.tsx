'use client';

import React, { useRef, useState } from 'react';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent, Checkbox } from '@nextui-org/react';

const TermsAndConditionsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => { setIsOpen(false), setIsScrolledToBottom(false) };
    const handleAgree = () => {
        alert('Bạn đã đồng ý với các điều khoản!');
        setIsOpen(false);
    };
    const handleScroll = () => {

        const contentElement = contentRef.current;
        if (contentElement) {
            const isAtBottom =
                contentElement.scrollTop + contentElement.clientHeight >= contentElement.scrollHeight;
            if (isAtBottom) {
                setIsScrolledToBottom(true); // Đánh dấu người dùng đã cuộn hết nội dung ít nhất một lần
            }
        }
    };
    return (
        <>
            {/* Nút mở modal */}
            <Button color="primary" onClick={handleOpen}>
                Đọc điều khoản & chính sách
            </Button>

            {/* Modal nội dung */}
            <Modal backdrop='blur' isOpen={isOpen} onClose={handleClose} closeButton size='5xl'>
                <ModalContent>
                    <ModalHeader className='justify-center'>
                        <h1 className='text-3xl font-bold'>Điều khoản & Chính sách dịch vụ</h1>
                    </ModalHeader>
                    <ModalBody>
                        <div
                            className='overflow-y-auto max-h-[70vh] scrollbar-hide'
                            ref={contentRef}
                            onScroll={handleScroll}
                        >
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>1. Điều khoản chung</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Khi đăng ký tài khoản và sử dụng dịch vụ, bạn đồng ý tuân thủ tất cả các điều khoản và điều kiện được đề cập trong tài liệu này.</li>
                                    <li>Trang thương mại điện tử có quyền thay đổi, bổ sung hoặc điều chỉnh các điều khoản và điều kiện bất kỳ lúc nào. Các thay đổi sẽ được thông báo qua email hoặc trên nền tảng của chúng tôi.</li>
                                    <li>Người dùng phải đủ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ hợp pháp để sử dụng dịch vụ.</li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>2. Đăng ký tài khoản và tạo cửa hàng</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Người dùng cần cung cấp thông tin chính xác, đầy đủ và hợp pháp khi đăng ký tài khoản.</li>
                                    <li>Mỗi tài khoản chỉ được phép đăng ký một cửa hàng trên nền tảng.</li>
                                    <li>Thông tin cửa hàng bao gồm: tên cửa hàng, mô tả sản phẩm, hình ảnh, địa chỉ kinh doanh và các thông tin liên hệ khác phải đảm bảo tính xác thực.</li>
                                    <li>Người dùng chịu trách nhiệm bảo mật thông tin tài khoản và không chia sẻ với bên thứ ba.</li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>3. Quyền và trách nhiệm của người dùng</h2>
                                <h3 className='font-medium mb-1 ml-1'>3.1. Quyền lợi:</h3>
                                <ul className='list-disc ml-5'>
                                    <li>Sử dụng nền tảng để đăng bán sản phẩm/dịch vụ hợp pháp.</li>
                                    <li>Được hỗ trợ kỹ thuật từ đội ngũ của chúng tôi trong quá trình sử dụng dịch vụ.</li>
                                    <li>Truy cập vào các công cụ phân tích và báo cáo kinh doanh.</li>
                                </ul>
                                <h3 className='font-medium my-1 ml-1'>3.2. Trách nhiệm:</h3>
                                <ul className='list-disc ml-5'>
                                    <li>Đảm bảo các sản phẩm/dịch vụ đăng bán không vi phạm pháp luật, bao gồm nhưng không giới hạn: hàng giả, hàng cấm, sản phẩm không rõ nguồn gốc, v.v.</li>
                                    <li>Cung cấp chính sách hoàn trả, đổi trả rõ ràng cho người mua.</li>
                                    <li>Không thực hiện các hành vi lừa đảo, gian lận hoặc gây tổn hại đến quyền lợi của người mua hoặc nền tảng.</li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>4. Phí dịch vụ</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Người dùng đồng ý thanh toán các khoản phí dịch vụ theo quy định, bao gồm phí giao dịch, phí quảng cáo, và các phí khác nếu có.</li>
                                    <li>Phí dịch vụ sẽ được trừ trực tiếp từ doanh thu bán hàng hoặc được thanh toán định kỳ qua các phương thức thanh toán hợp lệ.</li>
                                    <li>Các khoản phí không được hoàn trả trừ khi có quy định cụ thể trong chính sách hoàn phí.</li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>5. Chính sách bảo mật</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Chúng tôi cam kết bảo mật thông tin cá nhân và thông tin giao dịch của người dùng theo chính sách bảo mật của nền tảng.</li>
                                    <li>Người dùng chịu trách nhiệm cập nhật và duy trì tính bảo mật của mật khẩu và thông tin đăng nhập.</li>
                                    <li>Mọi hành vi truy cập trái phép hoặc lạm dụng tài khoản người dùng sẽ được xử lý nghiêm minh theo pháp luật.</li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>6. Quy định về nội dung đăng tải</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Người dùng chỉ được phép đăng tải nội dung (bao gồm văn bản, hình ảnh, video) liên quan trực tiếp đến sản phẩm/dịch vụ mà họ cung cấp.</li>
                                    <li>
                                        Nghiêm cấm đăng tải các nội dung:
                                        <ol className='list-decimal ml-5'>
                                            <li>Vi phạm pháp luật, thuần phong mỹ tục.</li>
                                            <li>Xúc phạm, đe dọa hoặc làm ảnh hưởng đến quyền lợi của người dùng khác.</li>
                                            <li>Chứa phần mềm độc hại, mã độc hoặc các nội dung gây hại khác.</li>
                                        </ol>
                                    </li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>7. Chính sách chấm dứt dịch vụ</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Người dùng có quyền chấm dứt sử dụng dịch vụ bất kỳ lúc nào bằng cách liên hệ với bộ phận hỗ trợ.</li>
                                    <li>
                                        Chúng tôi có quyền chấm dứt hoặc tạm ngưng tài khoản của người dùng nếu:
                                        <ol className='list-decimal ml-5'>
                                            <li>Vi phạm các điều khoản của nền tảng.</li>
                                            <li>Sử dụng dịch vụ cho các mục đích bất hợp pháp.</li>
                                        </ol>
                                    </li>
                                    <li>Trong trường hợp chấm dứt dịch vụ, chúng tôi không chịu trách nhiệm hoàn trả các khoản phí đã thanh toán trừ khi có quy định khác.</li>
                                </ul>
                            </div>
                            <div className='border-b pb-5 mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>8. Giải quyết tranh chấp</h2>
                                <ul className='list-disc ml-5'>
                                    <li>Mọi tranh chấp phát sinh giữa người dùng và nền tảng sẽ được ưu tiên giải quyết thông qua thương lượng và hòa giải.</li>
                                    <li>Nếu không đạt được thỏa thuận, tranh chấp sẽ được giải quyết theo pháp luật Việt Nam tại tòa án có thẩm quyền.</li>
                                </ul>
                            </div>
                            <div className='mb-5'>
                                <h2 className='text-xl font-semibold mb-2 ml-2'>9. Liên hệ</h2>
                                <h3>Nếu có bất kỳ thắc mắc nào liên quan đến điều khoản và chính sách dịch vụ, vui lòng liên hệ:</h3>
                                <ul className='list-["➤"] ml-5'>
                                    <li>Email: support@ecommerce.com</li>
                                    <li>Hotline: 1900-123-456</li>
                                </ul>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className='justify-between'>
                        <Checkbox
                            isDisabled={!isScrolledToBottom}
                            classNames={{
                                label: "text-small",
                            }}
                            className='justify-start'
                            onChange={(e) => setIsChecked(e.target.checked)}
                        >
                            Tôi đồng ý với các điều khoản và chính sách dịch vụ
                        </Checkbox>
                        <div className='justify-end'>
                            <Button className='mx-2' color="danger" onClick={handleClose}>
                                Hủy
                            </Button>
                            <Button isDisabled={!isChecked} className='mx-2' color="primary" onClick={handleAgree}>
                                Đồng ý
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TermsAndConditionsModal;

import { useHasMounted } from "@/utils/customHook";
import { Form, notification, Steps, Typography, Row, Col, ConfigProvider } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { Button, Input, InputOtp, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useTheme } from "next-themes";

const { Title, Text } = Typography;

const ModalChangePassword = (props: any) => {
    const { isModalOpen, setIsModalOpen } = props
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userEmail, setUserEmail] = useState("");
    const [value, setValue] = React.useState("");
    const hasMounted = useHasMounted();
    const { theme } = useTheme();
    const [showPassword, setShowPassword] = useState({
        password1: false,
        password2: false,
        password3: false,
    })

    const isDark = theme === "dark";
    if (!hasMounted) return <></>;

    const togglePasswordVisibility = (field: keyof typeof showPassword) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field], // Đảo trạng thái của trường được nhấn
        }));
    };

    const handleOtpChange = async (otp: string) => {
        setValue(otp);
        if (otp.length === 6) {
            try {
                const res = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-code`,
                    method: "POST",
                    body: { email: userEmail, code: otp },
                });

                if (res?.data) {
                    setCurrent(2); // Chuyển sang bước tiếp theo nếu thành công
                } else {
                    throw new Error(res?.message || "Call API failed");
                }
            } catch (error) {
                notification.error({
                    message: "Call APIs error",
                    description: "Mã xác thực không chính xác!",
                });
                setValue('');
            }
        }
    };

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/retry-password`,
            method: "POST",
            body: { email }
        });

        if (res?.data) {
            setUserEmail(email);
            setCurrent(1);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            });
        }
    };

    const onFinishStep1 = async (values: any) => {
        const { old_password, new_password, confirmNewPassword } = values;
        if (new_password !== confirmNewPassword) {
            notification.error({
                message: "Invalid input",
                description: "Mật khẩu và xác nhận mật khẩu không chính xác"
            });
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
            method: "POST",
            body: { old_password, new_password, email: userEmail }
        });

        if (res?.data) {
            setCurrent(3);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            });
        }
    };

    const restModal = () => {
        setIsModalOpen(false);
        setCurrent(0);
        setUserEmail("");
        setValue('');
        form.resetFields();
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: isDark ? "#fff" : "#000", // Màu đen
                    //colorPrimaryHover: isDark ? "#DCDCDC" : "#333333", // Màu khi hover
                },
            }}
        >
            <Modal
                title="Quên mật khẩu"
                isOpen={isModalOpen}
                className="custom-modal"
            >
                <ModalContent
                    style={{
                        width: "30%", // Tăng chiều rộng
                        maxWidth: "90%", // Giới hạn responsive chiều rộng
                        //height: "30%", // Tăng chiều cao
                        maxHeight: "90%", // Giới hạn responsive chiều cao
                    }}
                >
                    <>
                        <ModalHeader>
                            <Steps
                                current={current}
                                style={{ marginBottom: "20px", gap: '20px' }}
                                items={[
                                    { icon: <UserOutlined /> },
                                    { icon: <LockOutlined /> },
                                    { icon: <SolutionOutlined /> },
                                    { icon: <SmileOutlined /> },
                                ]}
                            />
                        </ModalHeader>

                        <ModalBody>
                            {current === 0 && (
                                <Row justify="center">
                                    <Col span={18}>
                                        <h1 style={{ textAlign: "center", marginBottom: '20px', fontSize: '25px' }}>
                                            Xác nhận Email
                                        </h1>
                                        <h2 >
                                            Vui lòng nhập email để nhận mã xác thực.
                                        </h2>
                                        <Form
                                            name="change-password"
                                            onFinish={onFinishStep0}
                                            autoComplete="off"
                                            layout="vertical"
                                            form={form}
                                            style={{ marginTop: "20px" }}
                                        >
                                            <Form.Item
                                                name="email"
                                            >
                                                <Input label='Email' labelPlacement="outside" isRequired type="email" name="email" />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="submit">
                                                    Gửi mã xác nhận
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                </Row>
                            )}

                            {current === 1 && (
                                //     <Row justify="center">
                                //         <Col span={18}>
                                //             <h1 style={{ textAlign: "center", marginBottom: '20px', fontSize: '25px' }}>
                                //                 Nhập mã xác thực
                                //             </h1>
                                //             <div style={{ width: '100%', textAlign: "center" }}>
                                //                 <h2>
                                //                     Vui lòng nhập mã xác thực gồm 6 số đã gửi qua email.
                                //                 </h2>
                                //             </div>
                                //             <Row
                                //                 justify="center"
                                //                 style={{
                                //                     // marginTop: "20px",
                                //                     // gap: "10px",
                                //                     // //display: "none",
                                //                     // marginBottom: "60px",
                                //                     // width: '55px',
                                //                     // height: "75px",
                                //                     // alignItems: "center",
                                //                     // flexDirection: "column",
                                //                     // outline: "none",
                                //                     // border: "2px solid #000",

                                //                     // Canh giữa
                                //                 }}
                                //             >
                                //                 {verificationCode.map((digit, index) => (
                                //                     <Input
                                //                         key={index}
                                //                         id={`verification-${index}`}
                                //                         maxLength={1} // Chỉ cho phép nhập 1 ký tự
                                //                         value={digit} // Giá trị hiện tại của ô nhập
                                //                         onChange={(e) => handleVerificationChange(index, e.target.value)} // Xử lý nhập liệu
                                //                         onKeyDown={(e) => handleKeyDown(index, e)} // Điều hướng khi nhấn Backspace
                                //                         onFocus={(e) => (e.target as HTMLInputElement).select()} // Tự động chọn nội dung khi focus
                                //                         style={{
                                //                             // textAlign: "center",
                                //                             // width: '100%',
                                //                             // height: "65px",
                                //                             // fontSize: "25px", // Kích thước chữ
                                //                             // borderRadius: "8px", // Bo góc
                                //                             // border: "2px solid #000", // Viền
                                //                             // outline: "none", // Xóa đường viền mặc định
                                //                             // transition: "all 0.2s", // Hiệu ứng chuyển đổi
                                //                         }}
                                //                     />
                                //                 ))}
                                //             </Row>

                                //             {/* <Button
                                //     type="primary"
                                //     onClick={onVerifyCode}
                                //     block
                                //     style={{
                                //         marginTop: "20px",
                                //     }}
                                // >
                                //     Xác nhận mã
                                // </Button> */}
                                //         </Col>
                                //     </Row>
                                <Row justify="center" >
                                    <Col span={18}>
                                        <h1 style={{ textAlign: "center", marginBottom: '20px', fontSize: '25px' }}>
                                            Nhập mã xác thực
                                        </h1>
                                        <div style={{ width: '100%', textAlign: "center", marginBottom: '20px' }}>
                                            <h2>
                                                Vui lòng nhập mã xác thực gồm 6 số đã gửi qua email.
                                            </h2>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: '20px' }}>
                                            <InputOtp length={6} value={value} onValueChange={handleOtpChange} size="lg" />
                                        </div>
                                        <div className="text-small text-default-500">
                                            Verification Code: <span className="text-md font-medium">{value}</span>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {current === 2 && (
                                <Row justify="center">
                                    <Col span={18}>
                                        <h1 style={{ textAlign: "center", marginBottom: '20px', fontSize: '25px' }}>
                                            Đổi mật khẩu
                                        </h1>
                                        <Form
                                            name="change-pass-2"
                                            onFinish={onFinishStep1}
                                            autoComplete="off"
                                            layout="vertical"
                                        >
                                            <Form.Item
                                                name="old_password"
                                            >
                                                <div style={{ position: "relative", height: "40px" }}>
                                                    <Input
                                                        label="Mật khẩu cũ"
                                                        labelPlacement="outside"
                                                        isRequired name="ole_password"
                                                        type={showPassword.password1 ? 'text' : 'password'}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                    />
                                                    <span
                                                        onClick={() => togglePasswordVisibility('password1')}
                                                        style={{
                                                            position: "absolute",
                                                            top: "50%", // Đặt ở giữa chiều cao input
                                                            right: "15px", // Cách lề phải
                                                            transform: "translateY(-50%)", // Căn giữa theo trục Y
                                                            cursor: "pointer", // Con trỏ pointer khi hover
                                                            color: "#999",
                                                        }}
                                                    >
                                                        {showPassword.password1 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                    </span>
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                name="new_password"
                                            >
                                                <div style={{ position: "relative", height: "40px" }}>
                                                    <Input
                                                        label="Mật khẩu mới"
                                                        labelPlacement="outside"
                                                        isRequired name="new_password"
                                                        type={showPassword.password2 ? 'text' : 'password'}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                    />
                                                    <span
                                                        onClick={() => togglePasswordVisibility('password2')}
                                                        style={{
                                                            position: "absolute",
                                                            top: "50%", // Đặt ở giữa chiều cao input
                                                            right: "15px", // Cách lề phải
                                                            transform: "translateY(-50%)", // Căn giữa theo trục Y
                                                            cursor: "pointer", // Con trỏ pointer khi hover
                                                            color: "#999",
                                                        }}
                                                    >
                                                        {showPassword.password2 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                    </span>
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                name="confirmNewPassword"
                                            >
                                                <div style={{ position: "relative", height: "40px" }}>
                                                    <Input
                                                        label="Xác nhận mật khẩu mới"
                                                        labelPlacement="outside"
                                                        isRequired name="confirmPassword"
                                                        type={showPassword.password3 ? 'text' : 'password'}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                        }}
                                                    />
                                                    <span
                                                        onClick={() => togglePasswordVisibility('password3')}
                                                        style={{
                                                            position: "absolute",
                                                            top: "50%", // Đặt ở giữa chiều cao input
                                                            right: "15px", // Cách lề phải
                                                            transform: "translateY(-50%)", // Căn giữa theo trục Y
                                                            cursor: "pointer", // Con trỏ pointer khi hover
                                                            color: "#999",
                                                        }}
                                                    >
                                                        {showPassword.password3 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                    </span>
                                                </div>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="submit">
                                                    Xác nhận
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                </Row>
                            )}

                            {current === 3 && (
                                <Row justify="center">
                                    <Col span={18}>
                                        <h1 style={{ textAlign: "center", marginBottom: '20px', fontSize: '25px' }}>
                                            Thành công!
                                        </h1>
                                        <h2 >
                                            Mật khẩu của bạn đã được thay đổi. Vui lòng đăng nhập lại.
                                        </h2>
                                    </Col>
                                </Row>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={restModal}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal >
        </ConfigProvider >
    );
};

export default ModalChangePassword;

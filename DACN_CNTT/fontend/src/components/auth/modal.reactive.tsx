'use client'
import { useHasMounted } from "@/utils/customHook";
import { Col, ConfigProvider, Form, notification, Row, Steps } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { sendRequest } from "@/utils/api";
import { Button, Input, InputOtp, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useTheme } from "next-themes";

const ModalReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
    const { theme } = useTheme();
    const hasMounted = useHasMounted();
    const isDark = theme === "dark";
    const [value, setValue] = React.useState("");

    useEffect(() => {
        if (userEmail) {
            form.setFieldValue("email", userEmail)
        }
    }, [userEmail]);

    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/retry-active`,
            method: "POST",
            body: {
                email
            }
        })

        if (res?.data) {
            setEmail(email)
            setUserId(res?.data?.id)
            setCurrent(1);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    const onFinishStep1 = async (otp: string) => {
        setValue(otp);
        if (otp.length === 6) {
            try {
                const res = await sendRequest<IBackendRes<any>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/active-user`,
                    method: "POST",
                    body: { id: userId, code: otp },
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
    }
    const restModal = () => {
        setIsModalOpen(false);
        setCurrent(0);
        setValue('');
        form.resetFields();
    };
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorText: isDark ? "#fff" : "#000",
                        colorPrimary: isDark ? "#fff" : "#000", // Màu đen
                        //colorPrimaryHover: isDark ? "#DCDCDC" : "#333333", // Màu khi hover
                    },
                }}
            >
                <Modal
                    title="Kích hoạt tài khoản"
                    isOpen={isModalOpen}
                    className="custom-modal"
                >
                    <ModalContent>

                        <ModalHeader>
                            <Steps
                                current={current}
                                items={[
                                    {
                                        title: 'Login',
                                        // status: 'finish',
                                        icon: <UserOutlined />,
                                    },
                                    {
                                        title: 'Verification',
                                        // status: 'finish',
                                        icon: <SolutionOutlined />,
                                    },

                                    {
                                        title: 'Done',
                                        // status: 'wait',
                                        icon: <SmileOutlined />,
                                    },
                                ]}
                            />
                        </ModalHeader>
                        <ModalBody>
                            {current === 0 &&
                                <>

                                    <div style={{ margin: "20px 0" }}>
                                        <p>Tải khoản của bạn chưa được kích hoạt</p>
                                    </div>
                                    <Form
                                        name="verify"
                                        onFinish={onFinishStep0}
                                        autoComplete="off"
                                        layout='vertical'
                                        form={form}
                                    >
                                        <Form.Item
                                            label=""
                                            name="email"
                                        >
                                            <Input disabled value={userEmail} />
                                        </Form.Item>
                                        <Form.Item
                                        >
                                            <Button type="submit">
                                                Gửi lại
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </>
                            }

                            {current === 1 &&
                                <>
                                    {/* <div style={{ margin: "20px 0" }}>
                                        <p>Vui lòng nhập mã xác nhận</p>
                                    </div>

                                    <Form
                                        name="verify2"
                                        onFinish={onFinishStep1}
                                        autoComplete="off"
                                        layout='vertical'

                                    >
                                        <Form.Item
                                            name="code"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                        >
                                            <Button type="submit">
                                                Kích hoạt
                                            </Button>
                                        </Form.Item>
                                    </Form> */}
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
                                                <InputOtp length={6} value={value} onValueChange={onFinishStep1} size="lg" />
                                            </div>
                                            <div className="text-small text-default-500">
                                                Verification Code: <span className="text-md font-medium">{value}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            }

                            {current === 2 &&
                                <>
                                    <h1 style={{ textAlign: "center", marginBottom: '20px', fontSize: '25px' }}>
                                        Tải khoản của bạn đã được kích hoạt thành công.
                                    </h1>
                                    <div style={{ width: '100%', textAlign: "center", marginBottom: '20px' }}>
                                        <h2>
                                            Vui lòng đăng nhập lại.
                                        </h2>
                                    </div>
                                </>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={restModal} >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </ConfigProvider >
        </>

    )
}

export default ModalReactive;

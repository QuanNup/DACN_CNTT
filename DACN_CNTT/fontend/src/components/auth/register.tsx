'use client'
import React, { useState } from 'react';
import { Col, Divider, Form, notification, Row } from 'antd';
import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Button, Input, Link } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { MdOutlinePassword } from 'react-icons/md';
import { User } from 'lucide-react';

export const MailIcon = (props: any) => {
    return (
        <svg
            height={20} viewBox="0 0 32 32" width={20}
            aria-hidden="true"
            fill="none"
            focusable="false"
            role="presentation"
            {...props}
        >
            <path
                d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"
                fill="currentColor"
            />
        </svg>
    );
};
export const GoogleIcon = (props: any) => {
    return (
        <svg
            height="20px" viewBox="0 0 576 512"
            aria-hidden="true"
            fill="none"
            focusable="false"
            role="presentation"
            {...props}
        >
            <path style={{ fill: '#FBBB00' }} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
      	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
      	C103.821,274.792,107.225,292.797,113.47,309.408z" />
            <path style={{ fill: '#518EF8' }} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
      	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
      	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" />
            <path style={{ fill: '#28B446' }} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
      	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
      	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" />
            <path style={{ fill: '#F14336' }} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
      	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
      	C318.115,0,375.068,22.126,419.404,58.936z" />
        </svg>
    );
};
const Register = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { theme } = useTheme();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const isDark = theme === "dark";
    const onFinish = async (values: any) => {
        const { email, password, name, confirmPassword } = values;
        if (password !== confirmPassword) {
            notification.error({
                message: "Invalid input",
                description: "Mật khẩu và xác nhận mật khẩu không chính xác"
            });
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
            method: "POST",
            body: {
                email, password, name
            }
        })
        if (res?.data) {
            router.push(`/verify/${res?.data?.id}`);
        } else {
            notification.error({
                message: "Register error",
                description: res?.message
            })
        }
    };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <h1 style={{
                        fontFamily: "'Black Ops One', sans-serif", // Sử dụng font Black Ops One
                        fontSize: "36px",
                        fontWeight: "400",
                        textAlign: "center",
                        textTransform: "uppercase"
                    }}
                    >Đăng Ký Tài Khoản</h1>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                        className='px-10'
                    >
                        <Form.Item
                            name="email"
                            style={{
                                marginBottom: "0", // Khoảng cách giữa các Form.Item
                                minHeight: "80px", // Chiều cao cố định cho Form.Item
                            }}
                        >
                            <Input
                                startContent=
                                {
                                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                                label='Email'
                                labelPlacement="outside"
                                placeholder='Email'
                                isRequired type="email"
                                name="email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            validateTrigger="onBlur" // Hiển thị lỗi khi rời khỏi trường nhập
                            style={{
                                marginBottom: "5px", // Khoảng cách giữa các Form.Item
                                minHeight: "80px", // Chiều cao cố định cho Form.Item
                            }}
                        >
                            <div style={{ position: "relative", height: "40px" }}>
                                {/* Input */}
                                <Input
                                    label="Mật khẩu"
                                    labelPlacement="outside"
                                    placeholder='Mật khẩu'
                                    startContent=
                                    {
                                        <MdOutlinePassword className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    type={showPassword ? "text" : "password"}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    isRequired
                                />
                                {/* Biểu tượng mắt */}
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        top: "50%", // Đặt ở giữa chiều cao input
                                        right: "15px", // Cách lề phải
                                        transform: "translateY(-50%)", // Căn giữa theo trục Y
                                        cursor: "pointer", // Con trỏ pointer khi hover
                                        color: "#999",
                                    }}
                                >
                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                </span>
                            </div>
                        </Form.Item>


                        <Form.Item
                            name="confirmPassword"
                            validateTrigger="onBlur" // Hiển thị lỗi khi rời khỏi trường nhập
                            style={{
                                marginBottom: "5px", // Khoảng cách giữa các Form.Item
                                minHeight: "80px", // Chiều cao cố định cho Form.Item
                            }}
                        >
                            <div style={{ position: "relative", height: "40px" }}>
                                {/* Input */}
                                <Input
                                    label="Xác nhận mật khẩu"
                                    labelPlacement="outside"
                                    placeholder='Xác nhận mật khẩu'
                                    startContent=
                                    {
                                        <MdOutlinePassword className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    type={showConfirmPassword ? "text" : "password"}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    isRequired
                                />
                                {/* Biểu tượng mắt */}
                                <span
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        top: "50%", // Đặt ở giữa chiều cao input
                                        right: "15px", // Cách lề phải
                                        transform: "translateY(-50%)", // Căn giữa theo trục Y
                                        cursor: "pointer", // Con trỏ pointer khi hover
                                        color: "#999",
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                </span>
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            style={{
                                marginBottom: "20px", // Khoảng cách giữa các Form.Item
                                minHeight: "80px", // Chiều cao cố định cho Form.Item
                            }}
                        >
                            <Input
                                label='Tên'
                                labelPlacement="outside"
                                placeholder='Tên người dùng'
                                startContent=
                                {
                                    <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button
                                className='relative overflow-hidden group z-10 hover:text-white duration-1000'
                                style={{
                                    width: '100%',
                                    fontWeight: "bold", // Chữ đậm
                                    fontSize: "16px", // Kích thước chữ lớn
                                    padding: "10px 20px", // Kích thước nút lớn hơn
                                    borderRadius: "8px", // Bo góc nút
                                    transition: "all 0.3s ease", // Hiệu ứng hover
                                    cursor: "pointer",
                                }}
                                type="submit">
                                <span
                                    className="absolute bg-gray-600 w-full h-36 rounded-full group-hover:scale-100 scale-0 -z-10  group-hover:duration-500 duration-700 origin-center transform transition-all"
                                />
                                <span
                                    className="absolute bg-gray-800 w-full h-36  rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"
                                />
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='mb-4' style={{ textAlign: "center" }}>
                        Đã có tài khoản?
                        <Link
                            className='font-bold px-2'
                            style={{
                                color: isDark ? '#fff' : '#000', // Màu trắng sáng
                                fontSize: '14px', // Chữ đậm
                                textDecoration: 'none', // Xóa gạch chân
                                transition: 'color 0.3s', // Hiệu ứng mượt mà khi hover
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#696969')} // Màu sáng hơn khi hover
                            onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#fff' : '#000')} href={"/auth/login"}
                        >
                            Đăng nhập
                        </Link>
                    </div>
                    <div className="flex-row mb-2 px-10">
                        <Button
                            className='w-full whitespace-pre md:flex group relative justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black '
                            radius='sm'
                            variant='bordered'>
                            <GoogleIcon /> Đăng nhập với Google
                        </Button>
                    </div>

                    <Link style={{
                        color: isDark ? '#fff' : '#000', // Màu trắng sáng
                        fontSize: '15px', // Chữ đậm
                        //fontStyle: "italic",
                        textDecoration: 'none', // Xóa gạch chân
                        transition: 'color 0.3s', // Hiệu ứng mượt mà khi hover
                    }} href={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                </fieldset>
            </Col>
        </Row>

    )
}

export default Register;

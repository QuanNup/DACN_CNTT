'use client'
import { Col, Divider, Form, message, notification, Row } from 'antd';
import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { authenticate } from '@/utils/action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ModalChangePassword from './modal.change.password';
import ModalReactive from './modal.reactive';
import { Button, Checkbox, Input, Link } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { MdOutlineFacebook, MdOutlinePassword } from 'react-icons/md';
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
export const FacebookIcon = (props: any) => {
    return (
        <svg
            height="20px" viewBox="0 0 576 512"
            aria-hidden="true"
            fill="none"
            focusable="false"
            role="presentation"
            {...props}
        >
            <path
                d="M7.71289 22H4.1898C3.60134 22 3.12262 21.5213 3.12262 20.9328V12.9863H1.06717C0.478672 12.9863 0 12.5074 0 11.9191V8.514C0 7.9255 0.478672 7.44683 1.06717 7.44683H3.12262V5.74166C3.12262 4.05092 3.6535 2.6125 4.65773 1.58207C5.6665 0.546992 7.07627 0 8.7346 0L11.4214 0.00438281C12.0089 0.00537109 12.4868 0.484086 12.4868 1.07151V4.23311C12.4868 4.82157 12.0083 5.30028 11.4199 5.30028L9.61091 5.30093C9.05919 5.30093 8.91868 5.41153 8.88864 5.44543C8.83914 5.50172 8.78023 5.66062 8.78023 6.09954V7.4467H11.284C11.4725 7.4467 11.6551 7.49319 11.812 7.58076C12.1506 7.76995 12.3611 8.12762 12.3611 8.51417L12.3597 11.9193C12.3597 12.5074 11.881 12.9861 11.2926 12.9861H8.78019V20.9328C8.78023 21.5213 8.30139 22 7.71289 22ZM4.41233 20.7103H7.49031V12.4089C7.49031 12.016 7.81009 11.6964 8.20282 11.6964H11.07L11.0712 8.73662H8.20265C7.80991 8.73662 7.49031 8.41706 7.49031 8.02411V6.09959C7.49031 5.59573 7.54153 5.0227 7.92185 4.59198C8.38144 4.07133 9.10568 4.01126 9.61056 4.01126L11.1971 4.01057V1.29375L8.73357 1.28975C6.06848 1.28975 4.41238 2.99574 4.41238 5.7417V8.02407C4.41238 8.4168 4.09277 8.73658 3.7 8.73658H1.28975V11.6964H3.7C4.09277 11.6964 4.41238 12.016 4.41238 12.4089L4.41233 20.7103Z"

            />
        </svg>
    );
};

const Login = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [changePassword, setChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
    const { theme } = useTheme();
    const [username, setUsername] = useState("");
    const [form] = Form.useForm();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Đổi trạng thái hiển thị mật khẩu
    };
    const isDark = theme === "dark";
    useEffect(() => {
        // Lấy thông tin từ localStorage và điền vào form
        const savedUsername = localStorage.getItem('username');
        if (savedUsername) {
            setUsername(savedUsername);
            form.setFieldsValue({ username: savedUsername });
        }
    }, [form]);
    const onFinish = async (values: any) => {
        const { username, password, remember } = values;
        setUserEmail("");
        //trigger sign-in
        const res = await authenticate(username, password);

        if (res?.error) {
            //error
            if (res?.code === 2) {
                setIsModalOpen(true);
                setUserEmail(username);
                return;
            }
            notification.error({
                message: "Error login",
                description: res?.error
            })

        } else {
            if (remember) {
                // Lưu thông tin đăng nhập nếu checkbox được chọn
                localStorage.setItem('username', username);
            } else {
                localStorage.removeItem('username');
            }
            message.success("Đăng nhập thành công !")
            router.push('/');
        }
    };
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`; // Gọi Google Login qua NextAuth
    };
    const handleFacebookLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook/login`; // Gọi Google Login qua NextAuth
    };
    return (
        <>
            <Row justify={"center"} style={{ marginTop: "30px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset style={{
                        padding: "20px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px"
                    }}>
                        <h1
                            style={{
                                fontFamily: "Black Ops One, sans-serif", // Sử dụng font Black Ops One
                                fontSize: "36px",
                                fontWeight: "400",
                                textAlign: "center",
                                textTransform: "uppercase"
                            }}
                        >
                            Đăng Nhập
                        </h1>

                        <Form
                            form={form}
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout='vertical'
                            className='px-10'
                        >
                            <Form.Item
                                style={{
                                    marginBottom: "0", // Khoảng cách giữa các Form.Item
                                    minHeight: "80px", // Chiều cao cố định cho Form.Item
                                }}
                                name="username"
                            >
                                < Input
                                    startContent=
                                    {
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label='Email'
                                    labelPlacement="outside"
                                    placeholder='Email'
                                    isRequired type="email"
                                    name="email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                validateTrigger="onBlur" // Hiển thị lỗi khi rời khỏi trường nhập
                                style={{
                                    marginBottom: "25px", // Khoảng cách giữa các Form.Item
                                    minHeight: "80px", // Chiều cao cố định cho Form.Item
                                }}
                            >
                                <div style={{ position: "relative", height: "40px" }}>
                                    {/* Input */}
                                    <Input
                                        startContent=
                                        {
                                            <MdOutlinePassword className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                        }
                                        label="Mật khẩu"
                                        labelPlacement="outside"
                                        placeholder='Mật khẩu'
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

                            {/* Checkbox lưu thông tin đăng nhập */}
                            <Form.Item name="remember" valuePropName="checked" initialValue={false}>
                                <div
                                    style={{
                                        display: "flex", // Kích hoạt Flexbox
                                        justifyContent: "space-between", // Căn hai phần tử về hai bên
                                        alignItems: "center", // Căn giữa theo chiều dọc
                                    }}
                                >
                                    <Checkbox color="default">
                                        Lưu thông tin đăng nhập
                                    </Checkbox>
                                    <Link
                                        style={{
                                            color: isDark ? "#fff" : "#000",
                                            fontSize: "15px",
                                            textDecoration: "none",
                                            transition: "color 0.3s",
                                        }}
                                        onClick={() => setChangePassword(true)}
                                    >
                                        Quên mật khẩu ?
                                    </Link>
                                </div>
                            </Form.Item>


                            <Form.Item
                            >
                                <div
                                    className='w-full flex content-between items-center'
                                >
                                    <Button
                                        className='w-full cursor-pointer font-bold text-base relative overflow-hidden group z-10 hover:text-white duration-1000'
                                        style={{
                                            padding: "10px 20px", // Kích thước nút lớn hơn
                                            borderRadius: "8px", // Bo góc nút
                                            transition: "all 0.3s ease", // Hiệu ứng hover
                                        }}
                                        type="submit" >
                                        <span
                                            className="absolute bg-gray-600 w-full h-36 rounded-full group-hover:scale-100 scale-0 -z-10  group-hover:duration-500 duration-700 origin-center transform transition-all"
                                        />
                                        <span
                                            className="absolute bg-gray-800 w-full h-36  rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"
                                        />
                                        Đăng nhập
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>


                        <div className='mb-2 text-center'>
                            Chưa có tài khoản?
                            <Link
                                className='font-bold px-2'
                                style={{
                                    color: isDark ? '#fff' : '#000', // Màu trắng sáng
                                    fontSize: '14px', // Chữ đậm
                                    textDecoration: 'none', // Xóa gạch chân
                                    transition: 'color 0.3s', // Hiệu ứng mượt mà khi hover
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#696969')} // Màu sáng hơn khi hover
                                onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? '#fff' : '#000')} href={"/auth/register"}
                            >
                                Đăng ký
                            </Link>
                        </div>

                        <p className="text-center mb-2">Hoặc với</p>
                        <div className="flex flex-col gap-2 mb-2 px-10">
                            <Button
                                onClick={() => handleGoogleLogin()}
                                className="w-full flex items-center justify-start gap-4 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black"
                                radius="sm"
                                variant="bordered"
                            >
                                {/* Logo Google */}
                                <div className="flex items-center justify-center w-8 h-8">
                                    <GoogleIcon className="w-6 h-6" />
                                </div>
                                <span className="flex-1 text-left">Đăng nhập với Google</span>
                            </Button>

                            <Button
                                onClick={() => handleFacebookLogin()}
                                className="w-full flex items-center justify-start gap-4 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black"
                                radius="sm"
                                variant="bordered"
                            >
                                {/* Logo Facebook */}
                                <div className="flex items-center justify-center w-8 h-8">
                                    <MdOutlineFacebook className="w-7 h-7 text-blue-500" />
                                </div>
                                <span className="flex-1 text-left">Đăng nhập với Facebook</span>
                            </Button>
                        </div>

                        <Link
                            style={{
                                color: isDark ? '#fff' : '#000', // Màu trắng sáng
                                fontSize: '15px', // Chữ đậm
                                //fontStyle: "italic",
                                textDecoration: 'none', // Xóa gạch chân
                                transition: 'color 0.3s', // Hiệu ứng mượt mà khi hover
                            }}
                            href={"/"}
                        >
                            <ArrowLeftOutlined />
                            Quay lại trang chủ
                        </Link>
                        <Divider />
                    </fieldset>
                </Col>
            </Row>
            <ModalReactive
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                userEmail={userEmail}
            />
            <ModalChangePassword
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
            />
        </>
    )
}

export default Login;

import Login from "@/components/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng nhập",
};
const LoginPage = async () => {
    return (
        <Login />
    )
}

export default LoginPage;
import Register from "@/components/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đăng ký",
};
const SignInPage = async () => {
    return (
        <Register />
    )
}

export default SignInPage;
import { Metadata } from "next";
import { SettingsSidebar } from "./ui/setting_sidebar";
import GeneralInfoForm from "./ui/general-info/general-info-form";
import { auth } from "@/auth";
import Footer from "@/components/layout/user/app.footer.user";

export const metadata: Metadata = {
    title: "Cài đặt",
};
export default async function SettingPage() {
    return (
        <>
            <GeneralInfoForm />
        </>
    )
}
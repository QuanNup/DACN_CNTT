'use client'
import ButtonUpload from "@/components/ui/ButtonUpload";
import { sendRequest, sendRequestFile } from "@/utils/api";
import { Avatar, Button, Card, cn, Input } from "@nextui-org/react";
import { getSession, useSession } from "next-auth/react";
import { useRef, useState } from "react";

export default function GeneralInfoForm() {
    const { data: session } = useSession();
    const [file, setFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">()
    const [name, setName] = useState(session?.user?.name || "");
    const [phone, setPhone] = useState(session?.user?.phone || "");
    const [address, setAddress] = useState(session?.user?.address || "")

    const formatPhoneNumber = (number: string) => {
        const cleaned = number.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{0,4})$/); // Chia thành các nhóm số
        if (match) {
            return `${match[1]} ${match[2]}${match[3] ? ` ${match[3]}` : ''}`; // Định dạng số điện thoại
        }
        return number; // Trả lại nguyên gốc nếu không khớp
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại ký tự số
        if (input.length <= 10) {
            const formatted = formatPhoneNumber(input); // Định dạng số ngay khi nhập
            setPhone(formatted); // Cập nhật state với số đã định dạng
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
            fetchUploadImageUser(event.target.files[0])
        }
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const fetchUploadImageUser = async (fileToUpload: File) => {
        setUploadStatus("uploading");
        const formData = new FormData()
        formData.append('image', fileToUpload)
        try {
            const response = await sendRequestFile<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-user`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                body: formData,
            });
            const data = response.data
            if (response.statusCode === 200) {
                setUploadStatus("success");
                await getSession()
                console.log("Cập nhật thành công:", data.image);
                await delay(6000);
                //window.location.reload()
                setUploadStatus("idle");
            } else {
                // Hiển thị trạng thái lỗi trong 3 giây, sau đó quay lại "idle"
                setUploadStatus("error");
                await delay(6000);
                setUploadStatus("idle");
            }
        } catch (error) {
            setUploadStatus("error");
            console.error("Cập nhật thất bại:", error);
            setUploadStatus("error");
            await delay(6000);
            setUploadStatus("idle");
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleSaveInfo = async () => {
        try {
            const response = await sendRequest<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/update-user`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                body: { name, phone, address },
            });

            if (response.statusCode === 200) {
                console.log("Cập nhật thành công:", response.data);
                await getSession(); // Tải lại session
            } else {
                console.error("Cập nhật thất bại:", response.message);
            }
        } catch (error) {
            console.error("Cập nhật thất bại:", error);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Thông tin chung</h2>
            <div className="grid lg:grid-cols-2 gap-4">
                <div>
                    <div className="flex flex-col gap-4 mb-5">
                        <h1>Tên</h1>
                        <Input
                            //defaultValue={session?.user.name}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Nhập tên của bạn"
                            variant="underlined"
                            isRequired
                        />
                    </div>
                    <div className="flex flex-col gap-4 mb-5">
                        <h1>Email</h1>
                        <Input
                            value={session?.user.email}
                            isDisabled
                            type="email"
                            placeholder="Nhập Email của bạn"
                            variant="underlined"
                            isRequired
                        />
                    </div>
                    <div className="flex flex-col gap-4 mb-5">
                        <h1>SĐT</h1>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                <span className="flex items-center">
                                    <svg width="800px" height="800px" viewBox="0 0 36 36" aria-hidden="true" role="img" className="iconify iconify--twemoji w-8 h-8 mr-1" preserveAspectRatio="xMidYMid meet">
                                        <path fill="#DA251D" d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z" />
                                        <path fill="#FF0" d="M19.753 16.037L18 10.642l-1.753 5.395h-5.672l4.589 3.333l-1.753 5.395L18 21.431l4.589 3.334l-1.753-5.395l4.589-3.333z" />
                                    </svg>
                                    <span className="text-sm font-medium">+84</span>
                                </span>
                            </div>
                            <Input
                                onChange={handlePhoneChange}
                                //defaultValue={session?.user.phone}
                                value={formatPhoneNumber(phone)}
                                type="tel"
                                className={cn(
                                    "pl-20 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                )}
                                placeholder="Nhập số điện thoại của bạn"
                                variant="underlined"
                                isRequired
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 mb-5">
                        <h1>Địa chỉ</h1>
                        <Input
                            //defaultValue={session?.user.address}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            type="text"
                            placeholder="Nhập địa chỉ của bạn"
                            variant="underlined"
                            isRequired
                        />
                    </div>
                </div>
                <div className="">
                    <div className="flex justify-center items-center gap-4 mb-5">
                        <div className="relative">
                            <Avatar
                                isBordered
                                //src={session?.user.image}
                                src={file ? URL.createObjectURL(file) : session?.user.image}
                                className='w-40 h-40 '
                                style={{ position: "relative", }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center items-center gap-4 mb-5">
                        <ButtonUpload uploadStatus={uploadStatus} title="Đổi ảnh đại diện" onClick={handleButtonClick} />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

            </div>
            <Button onClick={handleSaveInfo} variant="faded" radius="sm" className="w-[150px] p-2 mt-5">
                Lưu thông tin
            </Button>
        </div>
    )
}
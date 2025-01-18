'use client'
import { Image } from "@nextui-org/react";

interface Transaction {
    name: string;
    status: "Đang chờ" | "Thành công" | "Đã hủy";
    date: string;
    amount: number;
}
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(price);
};
const transactions: Transaction[] = [
    { name: "John Doe", status: "Đang chờ", date: "14.02.2024", amount: 179999999999999 },
    { name: "Jane Smith", status: "Thành công", date: "15.02.2024", amount: 280000 },
    { name: "Emily Davis", status: "Đã hủy", date: "16.02.2024", amount: 1698432 },
    { name: "Michael Brown", status: "Đang chờ", date: "17.02.2024", amount: 8000000 },
];

const Transactions: React.FC = () => {
    return (
        <div className=" p-5 rounded-lg bg-gradient-to-tr from-white to-gray-300 dark:from-[#282a36] dark:to-[#253352]">
            <h2 className="font-medium text-2xl mb-5">Giao dịch gần đây</h2>
            <table className="min-w-full w-full">
                <thead>
                    <tr >
                        <td className="p-2">Tên người dùng</td>
                        <td className="p-2">Trạng thái</td>
                        <td className="p-2">Ngày</td>
                        <td className="p-2">Số tiền</td>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index} >
                            <td className="p-2">
                                <div className="flex gap-2 items-center">
                                    <Image
                                        src="/noavatar.png"
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="object-cover rounded-full"
                                    />
                                    <span>{transaction.name}</span>
                                </div>
                            </td>
                            <td>
                                <span
                                    className={`rounded-md p-1.5 text-sm ${transaction.status === "Đang chờ"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : transaction.status === "Thành công"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {transaction.status}
                                </span>
                            </td>
                            <td>{transaction.date}</td>
                            <td>{formatPrice(transaction.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;

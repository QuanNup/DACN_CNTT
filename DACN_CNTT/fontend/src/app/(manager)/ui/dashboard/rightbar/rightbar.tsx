import Image from "next/image";
import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar: React.FC = () => {
    return (
        <div className="fixed">
            {/* Phần tử đầu tiên */}
            <div className="px-6 py-5 rounded-lg mb-5 relative bg-gradient-to-t from-white to-gray-300 dark:from-[#182237] dark:to-[#253352]">
                <div className="absolute right-0 bottom-0 w-1/2 h-1/2">
                    <Image
                        src="/astronaut.png"
                        alt="Quản lý cửa hàng"
                        layout="fill"
                        className="object-contain opacity-20"
                    />
                </div>
                <div className="flex flex-col gap-6">
                    <span className="font-bold">🔥 Tính năng mới</span>
                    <h3 className="font-medium text-xl">
                        Làm thế nào để quản lý sản phẩm hiệu quả hơn?
                    </h3>
                    <span className="text-sm text-gray-400">Mất 5 phút để tìm hiểu</span>
                    <p className="text-sm text-gray-400">
                        Hướng dẫn nhanh giúp bạn cập nhật và quản lý sản phẩm trong cửa hàng của mình một cách dễ dàng và hiệu quả.
                    </p>
                    <button
                        className="p-2.5 flex items-center gap-2.5 w-32 bg-gradient-to-br from-white to-gray-700 dark:bg-none dark:bg-purple-600 text-white rounded-md cursor-pointer"
                        aria-label="Xem hướng dẫn"
                    >
                        <MdPlayCircleFilled className="text-xl" /> Xem
                    </button>
                </div>
            </div>

            {/* Phần tử thứ hai */}
            <div className="px-6 py-5 rounded-lg mb-5 relative bg-gradient-to-t from-white to-gray-300 dark:from-[#182237] dark:to-[#253352]">
                <div className="flex flex-col gap-6">
                    <span className="text-sm font-semibold text-green-400">🚀 Cập nhật sắp ra mắt</span>
                    <h3 className="font-medium text-xl">
                        Tự động hóa quy trình xử lý đơn hàng
                    </h3>
                    <span className="text-sm text-gray-400">Tiết kiệm thời gian cho cửa hàng của bạn</span>
                    <p className="text-sm text-gray-400">
                        Tính năng xử lý đơn hàng tự động sẽ giúp bạn theo dõi, xử lý và hoàn thành đơn hàng nhanh chóng mà không cần thao tác thủ công.
                    </p>
                    <button
                        className="p-2.5 flex items-center gap-2.5 w-32 bg-gradient-to-br from-white to-gray-700 dark:bg-none dark:bg-purple-600 text-white rounded-md cursor-pointer"
                        aria-label="Tìm hiểu thêm"
                    >
                        <MdReadMore className="text-xl" /> Tìm hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hỗ trợ khách hàng",
};
export default function SupportPage() {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#C20E4D", marginBottom: "20px" }}>Hỗ Trợ Khách Hàng</h1>
            <p style={{ fontSize: "16px", lineHeight: "1.6", textAlign: "center", marginBottom: "20px" }}>
                Chào mừng đến với trang hỗ trợ của chúng tôi! Chúng tôi ở đây để giúp bạn giải quyết mọi thắc mắc và vấn đề bạn gặp phải khi sử dụng dịch vụ của chúng tôi. Hãy để chúng tôi giúp bạn!
            </p>

            <h2 style={{ marginBottom: "15px" }}>Câu hỏi thường gặp (FAQ)</h2>
            <ul style={{ listStyleType: "none", paddingLeft: "0", marginBottom: "30px" }}>
                <li style={{ marginBottom: "15px" }}>
                    <strong>Câu hỏi 1:</strong> Làm thế nào để khôi phục mật khẩu của tôi?
                    <p style={{ fontSize: "14px", marginTop: "5px" }}>
                        Để khôi phục mật khẩu, bạn chỉ cần nhấp vào "Quên mật khẩu" trên trang đăng nhập và làm theo hướng dẫn để nhận mã xác thực qua email.
                    </p>
                </li>
                <li style={{ marginBottom: "15px" }}>
                    <strong>Câu hỏi 2:</strong> Tôi có thể thay đổi thông tin tài khoản của mình như thế nào?
                    <p style={{ fontSize: "14px", marginTop: "5px" }}>
                        Để thay đổi thông tin tài khoản, bạn có thể đăng nhập vào trang cá nhân và chỉnh sửa thông tin trong phần "Cài đặt tài khoản".
                    </p>
                </li>
            </ul>

            <h2 style={{ marginBottom: "15px" }}>Liên hệ với chúng tôi</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "20px" }}>
                Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình trong phần câu hỏi thường gặp, vui lòng liên hệ với chúng tôi qua các phương thức dưới đây:
            </p>
            <ul style={{ listStyleType: "none", paddingLeft: "0", marginBottom: "30px" }}>
                <li style={{ marginBottom: "10px" }}>
                    <strong>Email hỗ trợ:</strong> support@yourcompany.com
                </li>
                <li style={{ marginBottom: "10px" }}>
                    <strong>Số điện thoại:</strong> 1800-123-456
                </li>
                <li style={{ marginBottom: "10px" }}>
                    <strong>Giờ làm việc:</strong> Thứ Hai đến Thứ Sáu, từ 9:00 AM đến 6:00 PM
                </li>
            </ul>

            <h2 style={{ marginBottom: "15px" }}>Thông tin khác</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                Nếu bạn gặp phải vấn đề nghiêm trọng hoặc có câu hỏi khẩn cấp, đừng ngần ngại liên hệ trực tiếp với chúng tôi qua các kênh hỗ trợ trên. Chúng tôi cam kết sẽ hỗ trợ bạn một cách nhanh chóng và hiệu quả nhất.
            </p>
        </div>
    );
}

import { useState, useEffect } from "react";

export const useTheme = () => {
    const [theme, setTheme] = useState<string>("light"); // Theme mặc định là "light"

    // Lấy theme từ localStorage khi ứng dụng khởi động
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme); // Áp dụng theme từ localStorage
        }
    }, []);

    // Hàm chuyển đổi theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme); // Cập nhật theme trong React state
        localStorage.setItem("theme", newTheme); // Lưu theme vào localStorage
    };

    return { theme, toggleTheme };
};

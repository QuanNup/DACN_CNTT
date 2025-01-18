"use client";
import React, { createContext, useContext, useRef } from "react";

const CartContext = createContext<{ cartIconRef: React.RefObject<HTMLDivElement> } | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const cartIconRef = useRef<HTMLDivElement>(null);

    return (
        <CartContext.Provider value={{ cartIconRef }}>{children}</CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
};

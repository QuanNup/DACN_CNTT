'use client';
import React, { useState } from 'react';
import { Card, Input, Button, Textarea, Spacer, Switch, CardHeader, CardBody, CardFooter, Modal, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import TermsAndConditionsModal from '@/components/ui/TermsAndConditionsModal';

const StoreSettingsPage = () => {
    // Trạng thái thông tin cửa hàng
    const [hasStore, setHasStore] = useState(false); // Kiểm tra nếu người dùng đã có cửa hàng
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [storeStatus, setStoreStatus] = useState(false);

    // Trạng thái modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Xử lý lưu cài đặt
    const handleSave = () => {
        console.log('Lưu cài đặt:', { storeName, storeDescription, storeStatus });
        alert('Cài đặt đã được lưu!');
    };

    // Xử lý đăng ký cửa hàng
    const handleRegisterStore = () => {
        setHasStore(true); // Giả lập người dùng đã đăng ký cửa hàng
        setIsModalOpen(true); // Đóng modal
    };

    return (
        <>
            <TermsAndConditionsModal />
        </>
    );
};

export default StoreSettingsPage;

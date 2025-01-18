import React from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import { MdPeople, MdShoppingBag, MdSupervisedUserCircle, MdAnalytics, MdAttachMoney, MdOutlineSettings, MdHelpCenter, MdShoppingCart } from 'react-icons/md';
import Cards from '../ui/dashboard_admin/card/card';
import { Metadata } from 'next';

const DashboardAdminGlobal: React.FC = () => {
    return (
        <>
            <div className="flex gap-5 my-8 ml-5"
                style={{
                    maxHeight: '100%', overflowY: 'auto', scrollbarWidth: 'none',
                }}
            >
                <div className="flex flex-col gap-5" style={{ flex: 3 }}>
                    <div className="flex gap-5 justify-between">
                        <Cards />
                    </div>
                </div>
            </div>

        </>
    );
};

export default DashboardAdminGlobal;
'use client'
import { Card } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/react";

export const SkeletonCard = () => (
    <Card className="w-[200px] space-y-5 p-4 h-[250px]" radius="lg">
        <Skeleton className="w-3/5 rounded-lg mb-5" style={{ height: '50%' }}>
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-3/5 rounded-lg mb-5" >
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg mb-5">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg mb-5">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
    </Card>
);
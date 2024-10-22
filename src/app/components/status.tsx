import React from 'react';
import { type IStatusProps } from "@/src/types/type";

const Status: React.FC<IStatusProps> = ({ verification }) => {
    return (
        <div >
            <p className="list-inside list-decimal text-base text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                Your Status: <span style={{ textDecoration: 'underline' }}>{verification}</span>.
            </p>
        </div>
    )
}

export default Status;
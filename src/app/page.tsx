"use client";
import { useState } from 'react';
import { Verify, Read, Status, Description, Metamask } from './components';
import { VerificationState } from './type';
import dotenv from 'dotenv';

dotenv.config({ path: '@/.env.local' });

export default function Home() {
    const [verification, setVerification] = useState<VerificationState>(VerificationState.Unverified);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
                <Metamask />
                <div className="flex gap-6 items-center flex-col sm:flex-row">
                    <Verify verification={verification} setVerification={setVerification} />
                    <Read />
                </div>
                <Status verification={verification} />
                <Description />
            </main>
        </div >
    );
}

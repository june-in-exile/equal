"use client";
import { useState } from 'react';
import Verify from '@/src/components/verify'
import Read from '@/src/components/read'
import Status from '@/src/components/status'
import Description from '@/src/components/description'
import { VerificationState } from '@/src/app/type/verification';

export default function Home() {
    const [verification, setVerification] = useState<VerificationState>(VerificationState.Unverified);
    const [attestationId, setAttestationId] = useState("");

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
                <div className="flex gap-6 items-center flex-col sm:flex-row">
                    <Verify setVerification={setVerification} setAttestationId={setAttestationId} />
                    <Read />
                </div>
                <Status verification={verification} attestationId={attestationId} />
                <Description />
            </main>
        </div>
    );
}

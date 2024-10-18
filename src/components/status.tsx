import React from 'react';
import Link from "next/link";
import { VerificationState, type IStatusProps } from "@/src/app/type/verification";

const Status: React.FC<IStatusProps> = ({ verification, attestationId }) => {
    return (
        <div >
            <p className="list-inside list-decimal text-base text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                Your Status: <span style={{ textDecoration: 'underline' }}>{verification}</span>.
            </p>
            {(verification === VerificationState.Unverified) ?
                <p className="mt-4">
                    (No Attestation Yet.)
                </p>
                :
                <p className="mt-4">
                    <Link
                        href={`https://scan.sign.global/attestation/${attestationId}`}
                        className="hover:text-gray-400 transition duration-200"
                        style={{
                            textShadow: '0 0 10px gray, 0 0 5px white', // 微亮效果
                        }} >
                        (View Attestation)
                    </Link>
                </p>
            }
        </div>
    )
}

export default Status;
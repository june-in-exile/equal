import { useEffect, useState, useCallback, useRef } from 'react';
import { VerificationState, type IVerifyProps } from '@/src/app/type';
import { verifyWorldId } from '../../utils/verifyWorldId';
import { VerificationLevel, IDKitWidget, useIDKit, type ISuccessResult } from "@worldcoin/idkit";
import Image from "next/image";
import Link from "next/link";

const Verify: React.FC<IVerifyProps> = ({ verification, setVerification }) => {
    const [loading, setLoading] = useState(false);
    const [worldIdVerifying, setWorldIdVerifying] = useState(false);
    const [worldIdVerified, setWorldIdVerified] = useState(false);
    const [worldIdValid, setWorldIdValid] = useState(false);
    const attestationId = useRef("");

    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
    const action = process.env.NEXT_PUBLIC_WLD_ACTION;

    if (!app_id) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!action) {
        throw new Error("action is not set in environment variables!");
    }

    const { open, setOpen } = useIDKit({});

    const handleClick = () => {
        setLoading(true);
        setWorldIdVerifying(true);
    };

    useEffect(() => {
        setOpen(worldIdVerifying);
    }, [worldIdVerifying, setOpen]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (worldIdVerifying) {
            interval = setInterval(() => {
                if (!open) {
                    setLoading(false);
                    setWorldIdVerifying(false);
                    clearInterval(interval);
                }
            }, 100);
        }
        return () => {
            clearInterval(interval);
        };
    }, [worldIdVerifying, open]);

    const handleWroldIdVerify = async (proof: ISuccessResult) => {
        console.log(
            "Proof received from IDKit, sending to backend:\n",
            JSON.stringify(proof)
        ); // Log the proof from IDKit to the console for visibility
        const data = await verifyWorldId(proof);
        if (data.success) {
            setWorldIdValid(true);
            console.log("World ID: Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
        } else {
            // throw new Error(`Verification failed: ${data.detail}`);
            console.log(`World ID: Verification failed: ${data.detail}`);
        }
        setWorldIdVerifying(false);
        setWorldIdVerified(true);
    };

    const onSuccess = (result: ISuccessResult) => {
        console.log(`Successfully verified with World ID with nullifier hash: ${result.nullifier_hash}`);
    };

    const handleTheOtherVerify = useCallback(async () => {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    worldIdValid: worldIdValid,
                }),
            });
            const res = await response.json();
            if (response.ok) {
                setVerification(VerificationState.Verified);
                attestationId.current = res.attestationId;
                alert('Verification succeeded.');
            } else {
                switch (res.reason) {
                    case "worldId":
                        setVerification(VerificationState.InvalidWorldId);
                        alert("Verification failed. Please check your World ID credentials.");
                        break;
                    case "metamask":
                        setVerification(VerificationState.MetamaskBalanceNotEnough);
                        alert("Verification failed. Please check your Metamask balance.");
                        break;
                    default:
                        setVerification(VerificationState.Unverified);
                        alert('Verification failed.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Try again');
        } finally {
            setLoading(false);
        }
    }, [worldIdValid, setVerification]);

    useEffect(() => {
        if (worldIdVerified) {
            handleTheOtherVerify();
        }
    }, [worldIdVerified, handleTheOtherVerify]);

    return (<>
        <IDKitWidget
            action={action}
            app_id={app_id}
            onSuccess={onSuccess}
            handleVerify={handleWroldIdVerify}
            verification_level={VerificationLevel.Device}
        />
        {(verification === VerificationState.Verified) ?
            <Link
                href={`https://scan.sign.global/attestation/${attestationId.current}`}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                target="_blank"
                rel="noopener noreferrer"
            >
                {'View attestation'}
            </Link>
            :
            <button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handleClick}
                disabled={loading}
            >
                <Image
                    className="dark:invert"
                    src="https://nextjs.org/icons/vercel.svg"
                    alt="Black triangle"
                    width={20}
                    height={20}
                />
                {loading ? 'Verifying...' : 'Verify now'}
            </button>
        }
    </>)
}

export default Verify;
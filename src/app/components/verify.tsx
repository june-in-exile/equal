import { useEffect, useState } from 'react';
import Image from "next/image";
import { VerificationState, type IVerifyProps } from '@/src/app/type';
import { verifyWorldId } from '../../utils/verifyWorldId';
import { VerificationLevel, IDKitWidget, useIDKit, type ISuccessResult } from "@worldcoin/idkit";

const Verify: React.FC<IVerifyProps> = ({ setVerification, setAttestationId }) => {
    const [loading, setLoading] = useState(false);
    const [worldIdVerified, setWorldIdVerified] = useState(false);
    const [worldIdValid, setWorldIdValid] = useState(false);

    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
    const action = process.env.NEXT_PUBLIC_WLD_ACTION;

    if (!app_id) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!action) {
        throw new Error("action is not set in environment variables!");
    }

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
            setWorldIdValid(false);
            // throw new Error(`Verification failed: ${data.detail}`);
            console.log(`World ID: Verification failed: ${data.detail}`);
        }
        setWorldIdVerified(true)
    };

    const onSuccess = (result: ISuccessResult) => {
        console.log(`Successfully verified with World ID with nullifier hash: ${result.nullifier_hash}`);
    };

    const { setOpen } = useIDKit({});

    useEffect(() => {
        if (worldIdVerified) {
            handleTheOtherVerify();
        }
    }, [worldIdVerified]);

    const handleTheOtherVerify = async () => {
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
                setAttestationId(res.attestationId);
                alert('Verification succeeded.');
            } else {
                switch (res.reason) {
                    case "worldId":
                        setVerification(VerificationState.InvalidWorldId);
                        alert("Verification failed. Please check your World ID credentials.")
                        break;
                    case "metamask":
                        setVerification(VerificationState.MetamaskBalanceNotEnough);
                        alert("Verification failed. Please check your Metamask balance.")
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
    };

    return (<>
        <IDKitWidget
            action={action}
            app_id={app_id}
            onSuccess={onSuccess}
            handleVerify={handleWroldIdVerify}
            verification_level={VerificationLevel.Device}
        />
        <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => {
                setLoading(true);
                setOpen(true);
            }}
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
    </>)
}

export default Verify;
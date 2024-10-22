import { useEffect, useState, useCallback, useRef } from 'react';
import { VerificationState, type IVerifyProps } from '../../types/type';
import { verifyWorldId } from '../../utils/verifyWorldId';
import { verifyMetamask, initMetaMaskSDK, setupProviderListeners, handleProviderUpdate } from '../../utils/verifyMetamask';
import { VerificationLevel, IDKitWidget, useIDKit, type ISuccessResult } from "@worldcoin/idkit";
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';

import Image from "next/image";
import Link from "next/link";
import dotenv from 'dotenv';

dotenv.config({ path: '@/.env.local' });

// FixMe:   In the WorldID verification, the first scanning doesn't work.
// FixMe:   After the first successful WorldID verification,
//          the second verification cannot finish (it just keeps verifying).
// XXX:     The code is bulky.

const Verify: React.FC<IVerifyProps> = ({ verification, setVerification }) => {
    const [loading, setLoading] = useState(false);

    // World ID
    const [worldIdVerifying, setWorldIdVerifying] = useState(false);
    const [worldIdVerified, setWorldIdVerified] = useState(false);
    const worldIdValid = useRef(false);
    const { open, setOpen } = useIDKit({});

    const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
    const action = process.env.NEXT_PUBLIC_WLD_ACTION;

    if (!app_id) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!action) {
        throw new Error("action is not set in environment variables!");
    }

    useEffect(() => {
        setOpen(worldIdVerifying);
    }, [worldIdVerifying]);

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

    useEffect(() => {
        if (worldIdVerified) {
            handleMetamaskVerify();
        }
    }, [worldIdVerified]);

    const handleWorldIdVerify = async (proof: ISuccessResult) => {
        console.log(
            "Proof received from IDKit, sending to backend:\n",
            JSON.stringify(proof)
        );
        const data = await verifyWorldId(proof);
        if (data.success) {
            worldIdValid.current = true;
            console.log("World ID: Successful response from backend:\n", JSON.stringify(data));
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

    // metamask
    const [sdk, setSDK] = useState<MetaMaskSDK>();
    const [account, setAccount] = useState<string>('');
    const [activeProvider, setActiveProvider] = useState<SDKProvider>();
    const metamaskValid = useRef(false);

    useEffect(() => {
        initMetaMaskSDK(setSDK);
    }, []);

    useEffect(() => {
        const cleanup = setupProviderListeners(sdk, activeProvider, setAccount);
        return cleanup;
    }, [activeProvider])

    useEffect(() => {
        const cleanup = handleProviderUpdate(sdk, setAccount, setActiveProvider);
        return cleanup;
    }, [sdk]);

    const handleMetamaskVerify = async () => {
        await verifyMetamask(metamaskValid, sdk)
        sendVerifyApi();
    };

    // sign protocol
    const attestationId = useRef("");

    const sendVerifyApi = useCallback(async () => {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    worldIdValid: worldIdValid.current,
                    metamaskValid: metamaskValid.current,
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
    }, [setVerification]);

    const handleVerify = () => {
        setLoading(true);
        setWorldIdVerifying(true);
    };

    return (<>
        <IDKitWidget
            action={action}
            app_id={app_id}
            onSuccess={onSuccess}
            handleVerify={handleWorldIdVerify}
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
                onClick={handleVerify}
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
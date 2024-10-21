import { useEffect, useState, useCallback, useRef } from 'react';
import { VerificationState, type IVerifyProps } from '../type';
import { verifyWorldId } from '../../utils/verifyWorldId';
import { VerificationLevel, IDKitWidget, useIDKit, type ISuccessResult } from "@worldcoin/idkit";
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { EventType } from '@metamask/sdk-communication-layer';
import Image from "next/image";
import Link from "next/link";
import dotenv from 'dotenv';

dotenv.config({ path: '@/.env.local' });

declare global {
    interface Window {
        ethereum?: SDKProvider;
    }
}

const Verify: React.FC<IVerifyProps> = ({ verification, setVerification }) => {
    const [loading, setLoading] = useState(false);
    const [worldIdVerifying, setWorldIdVerifying] = useState(false);
    const [worldIdVerified, setWorldIdVerified] = useState(false);
    const worldIdValid = useRef(false);
    const metamaskValid = useRef(false);
    const attestationId = useRef("");

    const [sdk, setSDK] = useState<MetaMaskSDK>();
    const [account, setAccount] = useState<string>('');
    const [activeProvider, setActiveProvider] = useState<SDKProvider>();

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

    useEffect(() => {
        const doAsync = async () => {
            const clientSDK = new MetaMaskSDK({
                useDeeplink: false,
                communicationServerUrl: process.env.NEXT_PUBLIC_COMM_SERVER_URL,
                checkInstallationImmediately: false,
                i18nOptions: {
                    enabled: true
                },
                dappMetadata: {
                    name: 'NEXTJS demo',
                    url: 'https://localhost:3000',
                },
                logging: {
                    developerMode: false,
                },
                storage: {
                    enabled: true,
                },
            });
            await clientSDK.init();
            setSDK(clientSDK);
        };
        doAsync();
    }, []);

    useEffect(() => {
        if (!sdk || !activeProvider) {
            return;
        }

        // activeProvider is mapped to window.ethereum.
        console.log(`App::useEffect setup active provider listeners`);
        if (window.ethereum?.getSelectedAddress()) {
            console.log(`App::useEffect setting account from window.ethereum `);
            setAccount(window.ethereum?.getSelectedAddress() ?? '');
        }

        const onInitialized = () => {
            console.log(`App::useEffect on _initialized`);
            if (window.ethereum?.getSelectedAddress()) {
                setAccount(window.ethereum?.getSelectedAddress() ?? '');
            }
        };

        const onAccountsChanged = (accounts: unknown) => {
            console.log(`App::useEfect on 'accountsChanged'`, accounts);
            setAccount((accounts as string[])?.[0]);
        };

        window.ethereum?.on('_initialized', onInitialized);

        window.ethereum?.on('accountsChanged', onAccountsChanged);

        return () => {
            console.log(`App::useEffect cleanup activeprovider events`);
            window.ethereum?.removeListener('_initialized', onInitialized);
            window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
        }
    }, [activeProvider])

    useEffect(() => {
        if (!sdk?.isInitialized()) {
            return;
        }

        const onProviderEvent = (accounts?: string[]) => {
            if (accounts?.[0]?.startsWith('0x')) {
                setAccount(accounts?.[0]);
            } else {
                setAccount('');
            }
            setActiveProvider(sdk.getProvider());
        };
        // listen for provider change events
        sdk.on(EventType.PROVIDER_UPDATE, onProviderEvent);
        return () => {
            sdk.removeListener(EventType.PROVIDER_UPDATE, onProviderEvent);
        };
    }, [sdk]);

    const connect = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask!');
            return;
        }
        try {
            const accounts = await window.ethereum.request<string[]>({
                method: 'eth_requestAccounts',
                params: [],
            });
            if (accounts && accounts.length > 0) {
                return accounts[0];
            }
        } catch (err) {
            console.error('Request accounts error:', err);
        }
    };

    const getBalance = async (account: string) => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask!');
            return;
        }
        try {
            const hexBalance = await window.ethereum.request<string>({
                method: 'eth_getBalance',
                params: [account, "latest"],
            });
            return hexBalance ? BigInt(hexBalance) : 0;
        } catch (err) {
            console.log('get balance ERR', err);
        }
    };

    const handleMetamaskVerify = async () => {
        const account = await connect();
        console.log(`account:`, account);

        if (account && /^0x[a-fA-F0-9]{40}$/.test(account)) {
            const balance = await getBalance(account);
            metamaskValid.current = (balance !== undefined && balance >= 0.02 * (10 ** 18));
        } else {
            console.error('Invalid account address:', account);
        }

        sdk?.terminate();
        console.log("disconnct from metamask");
        sendVerifyApi();
    };

    const sendVerifyApi = useCallback(async () => {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    worldIdValid: worldIdValid,
                    metamaskValid: metamaskValid,
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
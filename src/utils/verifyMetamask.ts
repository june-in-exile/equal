import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { EventType } from '@metamask/sdk-communication-layer';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';

function onInitialized(...args: any[]): void {
    throw new Error('Function not implemented.');
}

function onAccountsChanged(...args: any[]): void {
    throw new Error('Function not implemented.');
}

function onProviderEvent(...args: any[]): void {
    throw new Error('Function not implemented.');
}

export async function initMetaMaskSDK(
    setSDK: Dispatch<SetStateAction<MetaMaskSDK | undefined>>
) {
    try {
        const clientSDK = new MetaMaskSDK({
            useDeeplink: false,
            communicationServerUrl: process.env.NEXT_PUBLIC_COMM_SERVER_URL,
            checkInstallationImmediately: false,
            i18nOptions: {
                enabled: true,
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
    } catch (err) {
        console.error("Initializing MetaMask SDK error:", err);
        setSDK(undefined);
    }
};

export function setupProviderListeners(
    sdk: MetaMaskSDK | undefined,
    activeProvider: SDKProvider | undefined,
    setAccount: Dispatch<SetStateAction<string>>
) {
    if (!sdk || !activeProvider) return;

    try {
        const selectedAddress = window.ethereum?.getSelectedAddress();
        if (selectedAddress) {
            setAccount(selectedAddress);
        }

        const onInitialized = () => {
            try {
                const address = window.ethereum?.getSelectedAddress();
                if (address) {
                    setAccount(address);
                }
            } catch (error) {
                console.error('Error in onInitialized:', error);
            }
        };

        const onAccountsChanged = (...args: unknown[]) => {
            try {
                const accounts = args as string[];
                setAccount(accounts?.[0] ?? '');
            } catch (error) {
                console.error('Error in onAccountsChanged:', error);
            }
        };

        window.ethereum?.on('_initialized', onInitialized);
        window.ethereum?.on('accountsChanged', onAccountsChanged);
    } catch (error) {
        console.error('Setting up provider listeners error:', error);
    }

    return () => {
        try {
            window.ethereum?.removeListener('_initialized', onInitialized);
            window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
        } catch (error) {
            console.error('Removing provider listeners error:', error);
        }
    };
}


export function handleProviderUpdate(
    sdk: MetaMaskSDK | undefined,
    setAccount: Dispatch<SetStateAction<string>>,
    setActiveProvider: Dispatch<SetStateAction<SDKProvider | undefined>>
) {
    if (!sdk?.isInitialized()) return;

    try {
        const onProviderEvent = (accounts: string[]) => {
            if (accounts?.[0]?.startsWith('0x')) {
                setAccount(accounts?.[0]);
            } else {
                setAccount('');
            }
            setActiveProvider(sdk.getProvider());
        };

        sdk.on(EventType.PROVIDER_UPDATE, onProviderEvent);
    } catch (error) {
        console.error('Handling provider update error:', error);
    }

    return () => {
        try {
            sdk.removeListener(EventType.PROVIDER_UPDATE, onProviderEvent);
        } catch (error) {
            console.error('Removing provider listeners error:', error);
        }

    };
};

export async function connect() {
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

export async function getBalance(
    account: string | undefined
) {
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
        console.error('Get balance error:', err);
    }
};

export async function verifyMetamask(
    metamaskValid: MutableRefObject<boolean>,
    sdk: MetaMaskSDK | undefined
) {
    const account = await connect();
    console.log(`account:`, account);

    try {
        const balance = await getBalance(account);
        console.log(`balance: ${balance}`);
        metamaskValid.current = (balance! >= 0.02 * (10 ** 18));
    } catch {
        console.error('Invalid account address:', account);
    }

    sdk?.terminate();
    console.log("Disconncted from metamask.");
}
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { EventType } from '@metamask/sdk-communication-layer';
import { Dispatch, SetStateAction, MutableRefObject } from 'react';

export function initMetaMaskSDK(
    setSDK: Dispatch<SetStateAction<MetaMaskSDK | undefined>>
) {
    const doAsync = async () => {
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
    };
    doAsync();
};

export function setupProviderListeners(
    sdk: MetaMaskSDK | undefined,
    activeProvider: SDKProvider | undefined,
    setAccount: Dispatch<SetStateAction<string>>
) {
    if (!sdk || !activeProvider) return;

    console.log('App::useEffect setup active provider listeners');

    if (window.ethereum?.getSelectedAddress()) {
        console.log('App::useEffect setting account from window.ethereum');
        setAccount(window.ethereum?.getSelectedAddress() ?? '');
    }

    const onInitialized = () => {
        console.log('App::useEffect on _initialized');
        if (window.ethereum?.getSelectedAddress()) {
            setAccount(window.ethereum?.getSelectedAddress() ?? '');
        }
    };

    const onAccountsChanged = (...args: unknown[]) => {
        const accounts = args as string[];
        console.log('App::useEfect on accountsChanged', accounts);
        setAccount((accounts as string[])?.[0]);
    };

    window.ethereum?.on('_initialized', onInitialized);
    window.ethereum?.on('accountsChanged', onAccountsChanged);

    return () => {
        console.log('App::useEffect cleanup activeprovider events');
        window.ethereum?.removeListener('_initialized', onInitialized);
        window.ethereum?.removeListener('accountsChanged', onAccountsChanged);
    };
};

export function handleProviderUpdate(
    sdk: MetaMaskSDK | undefined,
    setAccount: Dispatch<SetStateAction<string>>,
    setActiveProvider: Dispatch<SetStateAction<SDKProvider | undefined>>
) {
    if (!sdk?.isInitialized()) return;

    const onProviderEvent = (accounts: string[]) => {
        if (accounts?.[0]?.startsWith('0x')) {
            setAccount(accounts?.[0]);
        } else {
            setAccount('');
        }
        setActiveProvider(sdk.getProvider());
    };

    sdk.on(EventType.PROVIDER_UPDATE, onProviderEvent);

    return () => {
        sdk.removeListener(EventType.PROVIDER_UPDATE, onProviderEvent);
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
    account: string
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
        console.log('get balance ERR', err);
    }
};

export async function verifyMetamask(
    metamaskValid: MutableRefObject<boolean>,
    sdk: MetaMaskSDK | undefined
) {
    const account = await connect();
    // console.log(`account:`, account);

    if (account && /^0x[a-fA-F0-9]{40}$/.test(account)) {
        const balance = await getBalance(account);
        // console.log(`balance: ${balance}`);
        metamaskValid.current = (balance !== undefined && balance >= 0.02 * (10 ** 18));
        // console.log(`metamaskValid: ${metamaskValid.current}`);
    } else {
        console.error('Invalid account address:', account);
    }
    sdk?.terminate();
    // console.log("disconnct from metamask");
}
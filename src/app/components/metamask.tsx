'use client';

import React, { useState, useEffect } from 'react';
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import {
    ConnectionStatus,
    EventType,
    ServiceStatus,
} from '@metamask/sdk-communication-layer';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: '@/.env.local' });

declare global {
    interface Window {
        ethereum?: SDKProvider;
    }
}

const Metamask = () => {
    const [sdk, setSDK] = useState<MetaMaskSDK>();
    const [account, setAccount] = useState<string>('');
    const [checked, setChecked] = useState(false);
    const [activeProvider, setActiveProvider] = useState<SDKProvider>();

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

    const checkBalance = async () => {
        const account = await connect();
        console.log(`account:`, account);
        
        if (account && /^0x[a-fA-F0-9]{40}$/.test(account)) {
            const balance = await getBalance(account);
            setChecked(balance !== undefined && balance >= 0.02 * (10 ** 18));
        } else {
            console.error('Invalid account address:', account);
        }

        sdk?.terminate();
        console.log("disconnct from metamask");
    };

    return (
        <>
            <button onClick={checkBalance}>
                CheckBalance
            </button>
            <h2>{`Account: ${account}`}</h2>
            <h2>{`Checked: ${checked}`}</h2>
        </>
    )
}

export default Metamask;
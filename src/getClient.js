import { SignProtocolClient, SpMode, OffChainSignType } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

export default async function getClient(privateKey = process.env.privateKey) {
    const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(privateKey),
    });

    return client;
}
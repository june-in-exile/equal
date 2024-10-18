import { SignProtocolClient, SpMode, OffChainSignType } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

export async function createOffChainSchema(name, data, privateKey = process.env.privateKey) {
    const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(privateKey),
    });

    const schemaInfo = await client.createSchema({
        name: name,
        data: data,
    });

    console.log(`Schema created. Check it on https://scan.sign.global/schema/${schemaInfo.schemaId}`)

    return schemaInfo;
}

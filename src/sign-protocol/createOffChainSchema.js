import {
    SignProtocolClient,
    SpMode,
    OffChainSignType,
} from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
const privateKey = process.env.privateKey; // optional
const client = new SignProtocolClient(SpMode.OffChain, {
    signType: OffChainSignType.EvmEip712,
    account: privateKeyToAccount(privateKey), // optional
});

const schemaInfo = await client.createSchema({
    name: 'EQual',
    data: [
        { name: 'World ID Verification', type: 'bool' },
        { name: 'Metamask Balance Check', type: 'bool' },
    ],
});

console.log(`schemaInfo: ${JSON.stringify(schemaInfo)}`);
// schemaInfo: { "schemaId": "SPS_YQIOv9XrF8VuTPfjT517j" }
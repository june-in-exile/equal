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

const attestationInfo = await client.createAttestation({
    schemaId: 'SPS_YQIOv9XrF8VuTPfjT517j',
    data: {
        "World ID Verification": "true",
        "Metamask Balance Check": "true"
    },
    indexingValue: 'hahaha',
});

console.log(`attestationInfo: ${JSON.stringify(attestationInfo)}`);
// attestationInfo: { "attestationId": "SPA_9wkQRpyn0RG0qt_BhA7AY" }
// attestationInfo: { "attestationId": "SPA_NTKFdF2YrDKsp4CC4BRRp" }
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

const attestationId = 'SPA_9wkQRpyn0RG0qt_BhA7AY';
const revokeAttestationRes = await client.revokeAttestation(attestationId, {
    reason: 'test',
});

console.log(`revokeAttestationRes: ${JSON.stringify(revokeAttestationRes)}`);
// revokeAttestationRes: { "attestationId": "SPA_9wkQRpyn0RG0qt_BhA7AY", "reason": "test" }
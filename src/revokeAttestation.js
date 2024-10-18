import { SignProtocolClient, SpMode, OffChainSignType } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

export async function revokeAttestation(attestationId, reason, privateKey = process.env.privateKey) {
    const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(privateKey),
    });

    const revocationInfo = await client.revokeAttestation(attestationId, {
        reason: reason,
    });

    console.log(`Attestation revoked. Check it on https://scan.sign.global/attestation/${revocationInfo.attestationId}`)

    return revocationInfo;
}
import { SignProtocolClient, SpMode, OffChainSignType } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

export async function createAttestation(schemaId, data, indexingValue, privateKey = process.env.privateKey) {
    const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(privateKey),
    });

    const attestationInfo = await client.createAttestation({
        schemaId,
        data,
        indexingValue,
    });

    console.log(`Attestation created. Check it on https://scan.sign.global/attestation/${attestationInfo.attestationId}`)

    return attestationInfo;
}
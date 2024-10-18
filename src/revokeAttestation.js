import getClient from './getClient.js';

export default async function revokeAttestation(attestationId, reason) {
    const client = await getClient();

    const revocationInfo = await client.revokeAttestation(attestationId, {
        reason: reason,
    });

    console.log(`Attestation revoked. Check it on https://scan.sign.global/attestation/${revocationInfo.attestationId}`)

    return revocationInfo;
}
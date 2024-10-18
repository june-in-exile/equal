import getClient from './getClient.js';

export default async function createAttestation(schemaId, data, indexingValue) {
    const client = await getClient();

    const attestationInfo = await client.createAttestation({
        schemaId,
        data,
        indexingValue,
    });

    console.log(`Attestation created. Check it on https://scan.sign.global/attestation/${attestationInfo.attestationId}`)

    return attestationInfo;
}
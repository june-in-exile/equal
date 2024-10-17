# How to use?

You can check your schemas and attestations on [signscan](https://scan.sign.global/).

## Create a Schema

1. Run the script: `node createOffChainSchema.js`
2. Record the printed schema ID. (e.g., `schemaInfo: { "schemaId": "SPS_YQIOv9XrF8VuTPfjT517j" }`)

## Create an Attestation

1. Fill in the `schemaId` field in `createAttestation.js` with the recorded schema ID.
2. Run the script: `node createAttestation.js`
3. Record the printed attestation ID. (e.g., `attestationInfo: { "attestationId": "SPA_9wkQRpyn0RG0qt_BhA7AY" }`)

## Revoke an Attestation
1. Fill in the `attestationId` field in `createAttestation.js` with the recorded attestation ID.
2. Run the script: `node revokeAttestation.js`
# How to use?

1. Create a Schema
   1. Run the script: `node --test createOffChainSchema.test.js`
   2. Record the schema ID in `.env.local` (field `schemaId`).
2. Create an Attestation
   1. Run the script: `node --test createAttestation.test.js`
   2. Record the attestation ID `.env.local` (field `attestationId`).
3. Revoke an Attestation
   1. Run the script: `node --test revokeAttestation.test.js`

You can check your schemas and attestations on [signscan](https://scan.sign.global/).
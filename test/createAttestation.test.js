import test from 'node:test';
import { strict as assert } from 'assert';
import createAttestation from '../src/createAttestation.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });
test('createAttestation should return attestation info', async () => {
    // Make sure that your data corresponds to the schema.
    const schemaId = process.env.schemaId;
    const data = {
        "World ID Verification": "true",
        "Metamask Balance Check": "true"
    };
    const indexingValue = 'hahaha';
    const attestationInfo = await createAttestation(schemaId, data, indexingValue);

    assert.ok(attestationInfo.attestationId, 'Attestation ID should exist');
});

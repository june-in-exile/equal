import test from 'node:test';
import { strict as assert } from 'assert';
import { revokeAttestation } from '../src/revokeAttestation.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });
test('revokeAttestation should return revocation info', async () => {
    const attestationId = process.env.attestationId;
    const reason = "for testing";
    const revocationInfo = await revokeAttestation(attestationId, reason);

    assert.ok(revocationInfo.attestationId, 'Revoked Attestation ID should exist');
});

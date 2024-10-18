import test from 'node:test';
import { strict as assert } from 'assert';
import createOffChainSchema from '../src/utils/createOffChainSchema.js';

test('createOffChainSchema should return schema info', async () => {
    const name = "EQual";
    // The type field is just for refernece. The actual type is always string.
    const data = [
        { name: 'World ID Verification', type: 'boolean' },
        { name: 'Metamask Balance Check', type: 'boolean' },
    ];
    const schemaInfo = await createOffChainSchema(name, data);

    assert.ok(schemaInfo.schemaId, 'Schema ID should exist');
});
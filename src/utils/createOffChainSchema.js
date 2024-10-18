import getClient from './getClient.js';

export default async function createOffChainSchema(name, data) {
    const client = await getClient();

    const schemaInfo = await client.createSchema({
        name: name,
        data: data,
    });

    console.log(`Schema created. Check it on https://scan.sign.global/schema/${schemaInfo.schemaId}`)

    return schemaInfo;
}
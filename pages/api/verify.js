import dotenv from 'dotenv';
import createAttestation from '@/src/createAttestation.js'

dotenv.config({ path: '@/.env.local' });

export default async function handler(req, res) {
    const schemaId = process.env.schemaId;
    const data = {
        "World ID Verification": "true",
        "Metamask Balance Check": "true"
    };
    const indexingValue = 'the verification pass';
    const attestationInfo = await createAttestation(schemaId, data, indexingValue);

    res.status(200).json({ attestationId: attestationInfo.attestationId });
    // res.status(405).json({ message: 'Method Not Allowed' });
}
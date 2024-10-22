import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import createAttestation from '@/src/utils/createAttestation.js'

dotenv.config({ path: '@/.env.local' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.worldIdValid) {
        res.status(401).json({ reason: "worldId" });
        return
    }

    if (!req.body.metamaskValid) {
        res.status(401).json({ reason: "metamask" });
        return
    }

    const schemaId = process.env.schemaId;
    const data = {
        "World ID Verification": "true",
        "Metamask Balance >= 0.02ETH": "true"
    };
    const indexingValue = 'Verification succeeded';
    const attestationInfo = await createAttestation(schemaId, data, indexingValue);

    res.status(200).json({ attestationId: attestationInfo.attestationId });
}
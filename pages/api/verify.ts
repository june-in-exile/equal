import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import createAttestation from '@/src/utils/createAttestation.js'

dotenv.config({ path: '@/.env.local' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    console.log("backend start verify...");

    const worldIdValid: boolean = req.body.worldIdValid;
    if (!worldIdValid) {
        res.status(401).json({ reason: "worldId" });
    }

    const metamaskValid: boolean = req.body.metamaskValid;
    if (!metamaskValid) {
        res.status(401).json({ reason: "metamask" });
    }

    const schemaId = process.env.schemaId;
    const data = {
        "World ID Verification": "true",
        "Metamask Balance Check": "true"
    };
    const indexingValue = 'the verification pass';
    const attestationInfo = await createAttestation(schemaId, data, indexingValue);

    res.status(200).json({ attestationId: attestationInfo.attestationId });
}
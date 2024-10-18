import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import verifyWorldId from '@/src/verifyWorldId.js'
import verifyMetamask from '@/src/verifyMetamask.js'
import createAttestation from '@/src/createAttestation.js'

dotenv.config({ path: '@/.env.local' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const worldIdVerified: boolean = verifyWorldId();
    if (!worldIdVerified) {
        res.status(401).json({ reason: "worldId" });
    }

    const metamaskVerified: boolean = verifyMetamask();
    if (!metamaskVerified) {
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
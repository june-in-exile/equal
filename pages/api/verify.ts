import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
import createAttestation from '@/src/utils/createAttestation.js'
import { VerificationState } from '@/src//types/type';

dotenv.config({ path: '@/.env.local' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.worldIdValid) {
        res.status(401).json({ reason: VerificationState.InvalidWorldId });
        return
    }

    if (!req.body.metamaskValid) {
        res.status(401).json({ reason: VerificationState.MetamaskBalanceNotEnough });
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
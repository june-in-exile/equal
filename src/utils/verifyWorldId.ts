"use server";

import { VerificationLevel } from "@worldcoin/idkit-core";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";

export type VerifyReply = {
    success: boolean;
    code?: string;
    attribute?: string | null;
    detail?: string;
};

interface IVerifyRequest {
    proof: {
        nullifier_hash: string;
        merkle_root: string;
        proof: string;
        verification_level: VerificationLevel;
    };
    signal?: string;
}

const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
const action = process.env.NEXT_PUBLIC_WLD_ACTION as string;

export async function verifyWorldId(
    proof: IVerifyRequest["proof"],
    signal?: string
): Promise<VerifyReply> {
    console.log("start verifyCloudProof...")
    const verifyRes = await verifyCloudProof(proof, app_id, action, signal);
    console.log("finish verifyCloudProof!")
    if (verifyRes.success) {
        return { success: true };
    } else {
        return { success: false, code: verifyRes.code, attribute: verifyRes.attribute, detail: verifyRes.detail };
    }
}

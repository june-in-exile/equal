enum VerificationState {
    Unverified = "unverified",
    WorldIdUnverified = "world_id_unverified",
    MetamaskUnverified = "metamask_unverified",
    Verified = "verified"

}

export { VerificationState };

// export const Verification = {
//     UNVERIFIED: 'Unverified',
//     WORLDID_UNVERIFIED: 'WorldIdUnverified',
//     METAMASK_UNVERIFIED: 'MetamaskUnverified',
//     VERIFIED: 'Verified',
// } as const;

// export type VerificationType = typeof Verification[keyof typeof Verification];
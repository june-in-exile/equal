export const Verification = {
    UNVERIFIED: 'Unverified',
    WORLDID_UNVERIFIED: 'World ID Unverified',
    METAMASK_UNVERIFIED: 'Metamask Unverified',
    VERIFIED: 'Verified',
} as const;

export type VerificationType = typeof Verification[keyof typeof Verification];
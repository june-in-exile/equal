enum VerificationState {
    Unverified = "unverified",
    WorldIdUnverified = "world_id_unverified",
    MetamaskUnverified = "metamask_unverified",
    Verified = "verified"

}

interface IVerifyProps {
    setVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
    setAttestationId: React.Dispatch<React.SetStateAction<string>>;
}

interface IStatusProps {
    verification: VerificationState;
    attestationId: string;
}

export { VerificationState, type IVerifyProps, type IStatusProps };
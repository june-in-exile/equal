enum VerificationState {
    Unverified = "unverified",
    InvalidWorldId = "invalid_world_id",
    MetamaskBalanceNotEnough = "not_enough_balance_in_metamask",
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
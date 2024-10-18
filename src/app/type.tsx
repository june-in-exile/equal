enum VerificationState {
    Unverified = "unverified",
    InvalidWorldId = "invalid_world_id",
    MetamaskBalanceNotEnough = "not_enough_balance_in_metamask",
    Verified = "verified"
}

interface IVerifyProps {
    verification: VerificationState;
    setVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
}

interface IStatusProps {
    verification: VerificationState;
}

export { VerificationState, type IVerifyProps, type IStatusProps };
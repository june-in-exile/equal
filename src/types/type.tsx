enum VerificationState {
    Unverified = "Unverified",
    InvalidWorldId = "Invalid world id",
    MetamaskBalanceNotEnough = "Not enough balance in metamask",
    Verified = "Verified"
}

interface IVerifyProps {
    verification: VerificationState;
    setVerification: React.Dispatch<React.SetStateAction<VerificationState>>;
}

interface IStatusProps {
    verification: VerificationState;
}

export { VerificationState, type IVerifyProps, type IStatusProps };
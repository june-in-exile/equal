import { Dispatch, SetStateAction } from 'react';
import { VerificationState } from '../types/type';

export function handleFailure(reason: VerificationState, setVerification: Dispatch<SetStateAction<VerificationState>>) {
    setVerification(reason);
    switch (reason) {
        case VerificationState.InvalidWorldId:
            alert("Verification failed. Please check your World ID credentials.");
            break;
        case VerificationState.MetamaskBalanceNotEnough:
            alert("Verification failed. Please check your Metamask balance.");
            break;
        default:
            setVerification(VerificationState.Unverified);
            alert('Verification failed.');
    }
}
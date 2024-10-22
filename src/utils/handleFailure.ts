import { VerificationState } from '../types/type';
import { Dispatch, SetStateAction } from 'react';

export function handleFailure(reason: string, setVerification: Dispatch<SetStateAction<VerificationState>>) {
    switch (reason) {
        case "worldId":
            setVerification(VerificationState.InvalidWorldId);
            alert("Verification failed. Please check your World ID credentials.");
            break;
        case "metamask":
            setVerification(VerificationState.MetamaskBalanceNotEnough);
            alert("Verification failed. Please check your Metamask balance.");
            break;
        default:
            setVerification(VerificationState.Unverified);
            alert('Verification failed.');
    }
}
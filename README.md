## Description

This is a side project that combines the following technologies:
- [Sign Protocol](https://sign.global/)
- [Worldcoin](https://world.org/world-id)
- [Metamask](https://metamask.io/)

The result is a notary attesting that the user is human and has >= 0.02 ETH so that he/she is quilified for the [ETHGlobal Bangkok](https://ethglobal.com/events/bangkok/).

## Prerequisite
1. Copy `.env.example` as `.env.local` and fill in the environment variables except for `schemaId` and `attestationId`.
   - `attestationId` is not necessary unless you want to run `./test/revokeAttestation.test.js`
2. To get `schemaId`, enter `./test` and follow the instructions to create a proper schema through sign protocol.
3. After you get the Schema ID, fill in the `schemaId` field in `.env.local`.

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TODO list

- [ ] Add CICD.
- [ ] Add a button to revoke the attestation
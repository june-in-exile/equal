This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Description
A notary (Sign Protocol) attesting that the user's account (metamask) is human (Worldcoin) and has over 0.02 ETH so that he is quilified for the ETHGlobal hackthon.

### Frontend
- [ ] One page only.
- [ ] A "Verify for the Qualification of ETHGlobal hackthon." button in the center.
- [ ] Explanations under the button.
  - "We verify two things: 1. You are human. 2. You have at least 0.02 ETH in the wallet."

### Backend
- [ ] An API attests that the user is qualified only if:
  - [ ] He/She passes the verification of World ID Incognito Action.
     - Try to use the simulator to implement the verification. 
  - [ ] His/Her Metamask wallet has at least 0.02 ETH.
     - Assume that he/she has only one account.
- This can be implemented through [ISPHook](https://docs.sign.global/for-builders/index-1/index/index/index/isphook).

On-Chain
- "[SIGNIE commitment](https://app.sign.global/schema/SPS_TGVj7wO0St5qhpa1Q5jwj)" schema 


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

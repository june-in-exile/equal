"use client";

import Image from "next/image";
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/verify', {
                method: 'GET',
            });
            if (response.ok) {
                alert('Success!');
            } else {
                alert('Fail!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Try again');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <button
                        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        <Image
                            className="dark:invert"
                            src="https://nextjs.org/icons/vercel.svg"
                            alt="Black triangle"
                            width={20}
                            height={20}
                        />
                        {/* Verify now */}
                        {loading ? 'Verifying...' : 'Verify now'}
                    </button>
                    <Link
                        href="https://github.com/june-in-exile/equal"
                        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                        target="_blank"
                        rel="noopener noreferrer">
                        Read our docs
                    </Link>
                </div>
                <div>
                    <p className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] mb-2">
                        Requirements for joining {" "}
                        <Link
                            className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold"
                            href="https://ethglobal.com/events/bangkok"
                            target="_blank"
                            rel="noopener noreferrer">
                            ETHGobal Bangkok
                        </Link>:
                    </p>
                    <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                        <li className="mb-2">
                            You are human (according to {" "}
                            <Link
                                className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold"
                                href="https://worldcoin.org/world-id"
                                target="_blank"
                                rel="noopener noreferrer">
                                World ID
                            </Link>
                            ).
                        </li>
                        <li>You have 0.02 ETH in the {" "}
                            <Link
                                className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold"
                                href="https://metamask.io/"
                                target="_blank"
                                rel="noopener noreferrer">
                                Metamask
                            </Link>
                            {" "}wallet.
                        </li>
                    </ol>
                </div>
            </main>
        </div>
    );
}

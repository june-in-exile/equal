import Link from "next/link";

const Description = () => {
    return (
        <div >
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
    )
}

export default Description;
"use client";
import Verify from '../components/verify'
import Read from '../components/read'
import Description from '../components/description'

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
                <div className="flex gap-6 items-center flex-col sm:flex-row">
                    <Verify>
                    </Verify>
                    <Read>
                    </Read>
                </div>
                <div>
                    <Description>
                    </Description>
                </div>
            </main>
        </div>
    );
}

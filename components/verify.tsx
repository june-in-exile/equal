import { useState } from 'react';
import Image from "next/image";

const Verify = () => {
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
    )
}

export default Verify;
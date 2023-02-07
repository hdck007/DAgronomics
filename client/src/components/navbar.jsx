import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Navbar() {
	const { address, isConnected } = useAccount();
	const [showRequest, setShowRequest] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (isConnected) {
			fetch(`/api/login?address=${address}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.authenticated && data.role === 'super') {
						setShowRequest(true);
					}
				});
		}
	}, []);

	return (
		<nav className='h-[10vh] flex items-center bg-base-300 justify-between sticky top-0 w-full z-20 bg-opacity-90'>
			<span
				onClick={() => router.push('/listing')}
				className='p-6 text-2xl font-extrabold cursor-pointer'
			>
				Dagronomics
			</span>
			{showRequest && (
				<span
					onClick={() => router.push(`/requests/${address}`)}
					className='p-6 text-2xl font-extrabold ml-auto justify-end cursor-pointer'
				>
					requests
				</span>
			)}
			<span className='justify-end px-4 text-primary self-center' >
				{isConnected && address}	
			</span>
		</nav>
	);
}

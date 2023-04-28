import { useConnect, useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../src/components/layout';
import useAuth from '../src/contexts/auth-context';

function Profile() {
	const { connect, connectors, error, isLoading, pendingConnector } =
		useConnect();
	const { isConnected, address } = useAccount();
	const { role } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isConnected && role) {
			if (!role) {
				router.push('/signup');
			} else {
				router.push('/listing');
			}
		}
	}, [isConnected, role]);

	return (
		<Layout>
			<div className='prose mx-auto h-[80vh] flex justify-center items-center'>
				<div className='w-2/3 mx-auto p-10 rounded-md shadow-sm bg-neutral'>
					<h3 className='my-4 px-2'>Click to login</h3>
					{connectors.map((connector) => (
						<button
							type='button'
							className='btn btn-primary w-full'
							key={connector.id}
							onClick={() => connect({ connector })}
						>
							Login
							{!connector.ready && ' (unsupported)'}
							{isLoading &&
								connector.id === pendingConnector?.id &&
								' (connecting)'}
						</button>
					))}
					{error && (
						<div className='text-sm px-2 text-error'>{error.message}</div>
					)}
					<button
						type='button'
						className='btn btn-primary w-full mt-4'
						onClick={() => router.push('/signup')}
					>
						Signup
					</button>
				</div>
			</div>
		</Layout>
	);
}

export default Profile;

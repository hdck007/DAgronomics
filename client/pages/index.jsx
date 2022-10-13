import { useConnect } from 'wagmi';
import Account from '../src/components/account';

function Profile() {
	const { connect, connectors, error, isLoading, pendingConnector } =
		useConnect();

	return (
		<div className='prose'>
			{connectors.map((connector) => (
				<button
					type='button'
					className='btn btn-primary'
					key={connector.id}
					onClick={() => connect({ connector })}
				>
					{connector.name}
					{!connector.ready && ' (unsupported)'}
					{isLoading &&
						connector.id === pendingConnector?.id &&
						' (connecting)'}
				</button>
			))}

			{error && <div>{error.message}</div>}
			<Account />
		</div>
	);
}

export default Profile;

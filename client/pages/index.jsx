import { useConnect, useAccount, useBalance } from 'wagmi';
import PropTypes from 'prop-types';

function Balance({ addressOrName }) {
	const { data, isError, isLoading } = useBalance({
		addressOrName,
	});

	if (isLoading) return <div>Fetching balance…</div>;
	if (isError) return <div>Error fetching balance</div>;
	return (
		<div>
			Balance: {data?.formatted} {data?.symbol}
		</div>
	);
}

Balance.propTypes = {
	addressOrName: PropTypes.string.isRequired,
};

function Account() {
	const { address, isConnecting, isDisconnected } = useAccount();

	if (isConnecting) return <div>Connecting…</div>;
	if (isDisconnected) return <div>Disconnected</div>;
	return (
		<div>
			{address}
			<Balance addressOrName={address} />
		</div>
	);
}

function Profile() {
	const { connect, connectors, error, isLoading, pendingConnector } =
		useConnect();

	return (
		<div>
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

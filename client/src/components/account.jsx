import { useAccount } from 'wagmi';
import Balance from './balance';

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

export default Account;

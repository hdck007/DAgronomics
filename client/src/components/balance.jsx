import { useBalance } from 'wagmi';
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

export default Balance;

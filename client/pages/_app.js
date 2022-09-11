import { WagmiConfig } from 'wagmi';
import '../styles/global.css';
import PropTypes from 'prop-types';
import client from '../lib/wagmi/chain-config';

function MyApp({ Component, pageProps }) {
	return (
		<WagmiConfig client={client}>
			<Component {...pageProps} />
		</WagmiConfig>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};

export default MyApp;

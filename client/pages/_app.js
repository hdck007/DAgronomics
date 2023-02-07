import { WagmiConfig } from 'wagmi';
import '../styles/global.css';
import PropTypes from 'prop-types';
import client from '../lib/wagmi/chain-config';
import { AuthProvider } from '../src/contexts/auth-context';

function MyApp({ Component, pageProps }) {
	return (
		<WagmiConfig client={client}>
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</WagmiConfig>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};

export default MyApp;

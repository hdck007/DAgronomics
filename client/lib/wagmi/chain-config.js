import { chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, provider, webSocketProvider } = configureChains(
	[chain.hardhat, chain.localhost],
	[
		jsonRpcProvider({
			rpc: () => ({
				http: `http://127.0.0.1:8545/`,
			}),
		}),
		publicProvider(),
	]
);

const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
	connectors: [
		new InjectedConnector({
			chains,
			options: {
				name: 'Injected',
				shimDisconnect: true,
			},
		}),
	],
});

export default client;

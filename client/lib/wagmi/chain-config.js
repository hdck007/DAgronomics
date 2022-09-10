import { chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider } = configureChains(
	[chain.hardhat, chain.localhost],
	[
		jsonRpcProvider({
			rpc: (chainInfo) => ({
				http: `https://${chainInfo.id}.example.com`,
			}),
		}),
		publicProvider(),
	]
);

const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});

export default client;

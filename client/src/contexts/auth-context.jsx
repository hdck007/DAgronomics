import React, { useEffect, useMemo } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { useRouter } from 'next/router';
import { abi, contractaddress } from '../constants';

// create a auth context to check if the user is authenticated or not
export const AuthContext = React.createContext({});

export function AuthProvider({ children }) {
	const { address, isConnected } = useAccount();
	const router = useRouter();
	const [isFarmer, setIsFarmer] = React.useState(false);
	const [isDistributor, setIsDistributor] = React.useState(false);
	const [isRetailer, setIsRetailer] = React.useState(false);
	const { refetch: farmerFetch } = useContractRead({
		args: [address],
		contractInterface: abi,
		addressOrName: contractaddress,
		functionName: 'isFarmer',
	});
	const { refetch: distributorFetch } = useContractRead({
		args: [address],
		contractInterface: abi,
		addressOrName: contractaddress,
		functionName: 'isDistributor',
	});

	const { refetch: retailerFetch } = useContractRead({
		args: [address],
		contractInterface: abi,
		addressOrName: contractaddress,
		functionName: 'isRetailer',
	});

	useEffect(() => {
		if (isConnected) {
			farmerFetch(address).then((res) => {
				if (res.data) {
					setIsFarmer(true);
				}
			});
			distributorFetch(address).then((res) => {
				if (res.data) {
					setIsDistributor(true);
				}
			});
			retailerFetch(address).then((res) => {
				if (res.data) {
					setIsRetailer(true);
				}
			});
		}
	}, [isConnected, address]);

	const value = useMemo(() => {
		let theRole = isFarmer
			? 'farmer'
			: isDistributor
			? 'distributor'
			: 'retailer';
		if (isFarmer && isDistributor && isRetailer) {
			theRole = 'super';
		}
		if (!isFarmer && !isDistributor && !isRetailer) {
			theRole = false;
		}
		console.log(theRole);
		return {
			role: theRole,
		};
	}, [isFarmer, isDistributor, isRetailer, router]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
	return React.useContext(AuthContext);
}

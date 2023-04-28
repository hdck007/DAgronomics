import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { useRouter } from 'next/router';
import { abi, contractaddress } from '../constants';

// create a auth context to check if the user is authenticated or not
export const AuthContext = React.createContext({});

export function AuthProvider({ children }) {
	const { address, isConnected } = useAccount();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState({
		farmer: true,
		distributor: true,
		retailer: true,
	});
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
		setIsFarmer(false);
		setIsDistributor(false);
		setIsRetailer(false);
		setIsLoading({
			farmer: true,
			distributor: true,
			retailer: true,
		});
		if (isConnected) {
			console.log('This should run again', address);
			farmerFetch(address).then((res) => {
				if (res.data) {
					setIsFarmer(true);
				}
				setIsLoading((prev) => ({
					...prev,
					farmer: false,
				}));
			});
			distributorFetch(address).then((res) => {
				if (res.data) {
					setIsDistributor(true);
				}
				setIsLoading((prev) => ({
					...prev,
					distributor: false,
				}));
			});
			retailerFetch(address).then((res) => {
				if (res.data) {
					setIsRetailer(true);
				}
				setIsLoading((prev) => ({
					...prev,
					retailer: false,
				}));
			});
		}
	}, [isConnected, address, setIsLoading]);

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
		return {
			role: theRole,
		};
	}, [isFarmer, isDistributor, isRetailer, address]);

	useEffect(() => {
		if (!isLoading.farmer && !isLoading.distributor && !isLoading.retailer) {
			if (!value.role) {
				if (router.pathname !== 'signup' || router.pathname !== '/') {
					router.push('/');
				}
			} else {
				if (router.pathname === '/signup' || router.pathname === '/') {
					router.push('/listing');
				}
			}
		}
	}, [isLoading, value]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
	return React.useContext(AuthContext);
}

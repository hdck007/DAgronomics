import React, { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

// create a auth context to check if the user is authenticated or not
export const AuthContext = React.createContext({});

export function AuthProvider({ children }) {
	const { address, isConnected } = useAccount();
	const router = useRouter();
	const [role, setRole] = React.useState('');

	useEffect(() => {
		if (isConnected) {
			fetch(`/api/login?address=${address}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.authenticated && data.role) {
						setRole(data.role);
						console.log(data.role)
						// check the current route
						if (
							router.pathname === '/signup' ||
							router.pathname === '/' ||
							router.pathname === '/login'
						) {
							router.push('/listing');
						}
					} else {
						setRole('');
						router.push('/signup');
					}
				});
		}
	}, [isConnected]);

	const value = useMemo(
		() => ({
			role,
		}),
		[role]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
	return React.useContext(AuthContext);
}
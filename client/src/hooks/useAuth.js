import { useEffect } from "react"
import {useAccount } from "wagmi";
import { useRouter } from "next/router";

export default function useAuth(){
  const { isConnected, isLoading } = useAccount();
	const router = useRouter();
	useEffect(() => {
		if (!isLoading && !isConnected) {
			router.push('/');
		}
	}, [isLoading, isConnected]);
}
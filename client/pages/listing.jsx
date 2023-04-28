/* eslint-disable no-underscore-dangle */
import { useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../src/components/layout';
import ListComponent from '../src/components/listing-component';
import { abi, contractaddress } from '../src/constants';
import { useRouter } from 'next/router';
import useAuth from '../src/contexts/auth-context';

function Listing() {
	const [crops, setCrops] = useState([]);
	const { refetch } = useContractRead({
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getAllProducts',
	});
	const router = useRouter();
	const { role } = useAuth();

	useEffect(() => {
		refetch().then((data) => {
			if (data.isError) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Something went wrong!',
				});
			}
			console.log(data);
			const cropArray = data?.data?.map((item) => ({
				id: item.productIndex._hex,
				name: item.name,
				description: item.description,
				image: `https://${item.productImage}.ipfs.nftstorage.link/file`,
				location: item.originFarmInformation,
			}));
			if (cropArray) {
				setCrops(cropArray);
			}
		});
	}, []);

	useEffect(() => {
		if (!role) {
			router.push('/');
		}
	}, [role]);

	const handleRoute = () => {
		if (role && (role === 'super' || role === 'farmer')) {
			router.push('/create');
		} else {
			Swal.fire({
				icon: 'error',
				title: 'OOPs!',
				text: 'Only farmers and superusers can create items',
			});
		}
	};

	return (
		<Layout>
			<div className='prose prose-h1:text-4xl w-full py-10 max-w-6xl mx-auto'>
				<ListComponent data={crops} />
				{(role === 'farmer' || role === 'super') && (
					<button
						onClick={handleRoute}
						className='py-2 px-4 btn-secondary fixed bottom-10 right-10 rounded-full text-white'
					>
						Create Item +
					</button>
				)}
			</div>
		</Layout>
	);
}

export default Listing;

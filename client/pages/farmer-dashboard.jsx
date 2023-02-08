/* eslint-disable no-underscore-dangle */
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../src/components/layout';
import { abi, contractaddress } from '../src/constants';
import { useRouter } from 'next/router';

function Listing() {
	const [crops, setCrops] = useState([]);
	const router = useRouter();
	const { address, isConnected } = useAccount();
	const { refetch } = useContractRead({
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getProducts',
	});

	const { write: shipProduct } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'shippedItemByFarmer',
		onSettled: (data, error) => {
			if (error) {
				console.error(error);
				Swal.fire({
					icon: 'error',
					text: 'Some error occured',
				});
			} else {
				console.log(data);
				Swal.fire({
					icon: 'success',
					text: 'Shipped the product',
				});
			}
		},
	});

	const handleApprove = (id) => (e) => {
		e.preventDefault();
		router.push(`/details/${id}`);
	};

	const handleShip = (id) => (e) => {
		e.preventDefault();
		shipProduct({ recklesslySetUnpreparedArgs: [id] });
	};

	useEffect(() => {
		if (isConnected && address) {
			refetch().then((data) => {
				if (data.isError) {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
				}
				const cropArray = data?.data
					?.map((item) => ({
						id: Number(item.productIndex._hex),
						name: item.name,
						price: Number(item.productPrice._hex),
						state: item.itemState,
						owner: item.ownerID,
						farmer: item.originFarmerID,
					}))
					?.filter((item) => item.farmer === address);
				if (cropArray) {
					console.log(cropArray);
					setCrops(cropArray);
				}
			});
		}
	}, [isConnected, address]);

	return (
		<Layout>
			<div className='prose prose-h1:text-4xl w-full py-10 max-w-6xl mx-auto px-4'>
				<div>
					<h2>My products to be approved</h2>
					<div>
						{crops.filter((crop) => crop.state === 1).length === 0 && (
							<p>No products to be approved</p>
						)}
						{crops
							.filter((crop) => crop.state === 1)
							.map((crop) => (
								<div
									key={crop.id}
									className='border-b border-primary shadow-sm  flex p-4 items-center justify-between'
								>
									<span className='font-semibold text-xl'>{crop.name}</span>
									<span className='self-end ml-auto mr-2 relative bottom-2 border border-secondary rounded-full px-4'>
										Price: {crop.price}
									</span>
									<button
										className='btn btn-primary self-end'
										onClick={handleApprove(Number(crop.id))}
									>
										Approve
									</button>
								</div>
							))}
					</div>
				</div>
				<div>
					<h2>My products to be shipped</h2>
					<div>
						{crops.filter((crop) => crop.state === 2).length === 0 && (
							<p>No products to be shipped</p>
						)}
						{crops
							.filter((crop) => crop.state === 2)
							.map((crop) => (
								<div
									key={crop.id}
									className='border-b border-primary shadow-sm  flex p-4 items-center justify-between'
								>
									<span className='font-semibold text-xl'>{crop.name}</span>
									<span className='self-end ml-auto mr-2 relative bottom-2 border border-secondary rounded-full px-4'>
										Price: {crop.price}
									</span>
									<button
										className='btn btn-primary self-end'
										onClick={handleShip(Number(crop.id))}
									>
										Ship
									</button>
								</div>
							))}
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default Listing;

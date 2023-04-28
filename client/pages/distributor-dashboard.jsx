/* eslint-disable no-underscore-dangle */
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../src/components/layout';
import { abi, contractaddress } from '../src/constants';
import { useRouter } from 'next/router';

function Listing() {
	const [crops, setCrops] = useState([]);
	const [_, setRefetch] = useState(0);
	const router = useRouter();
	const { address, isConnected } = useAccount();
	const { refetch } = useContractRead({
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getAllProducts',
	});

	const { write: receiveProduct } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'receivedItemByDistributor',
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
					text: 'Receiving end recorded',
				});
			}
		},
	});

	const { write: processProduct } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'processedItemByDistributor',
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
					text: 'Processing step recorded',
				});
			}
		},
	});

	const { write: packProduct } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'packageItemByDistributor',
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
					text: 'Processing step recorded',
				});
			}
		},
	});

	const { write: shipProduct } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'shippedItemByDistributor',
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
					text: 'Product shipped',
				});
			}
		},
	});

	const handleShip = (id) => (e) => {
		e.preventDefault();
		shipProduct({ recklesslySetUnpreparedArgs: [id] });
	};

	const handleSell = (id) => (e) => {
		e.preventDefault();
		router.push(`/details/${id}`);
	};

	const handlePack = (id) => (e) => {
		e.preventDefault();
		packProduct({ recklesslySetUnpreparedArgs: [id] });
	};

	const handleReceive = (id) => (e) => {
		e.preventDefault();
		receiveProduct({ recklesslySetUnpreparedArgs: [id] });
	};

	const handleProcess = (id) => (e) => {
		e.preventDefault();
		processProduct({ recklesslySetUnpreparedArgs: [id] });
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
				console.log(data);
				const cropArray = data?.data
					?.map((item) => ({
						id: Number(item.productIndex._hex),
						name: item.name,
						price: Number(item.productPrice._hex),
						state: item.itemState,
						owner: item.ownerID,
						distributor: item.distributorID,
					}))
					?.filter((item) => item.distributor === address);
				if (cropArray) {
					setCrops(cropArray);
					console.log(cropArray);
				}
			});
		}
	}, [isConnected, address, _]);

	return (
		<Layout>
			<div className='prose prose-h1:text-4xl w-full py-10 max-w-6xl mx-auto px-4'>
				<div>
					<h2>My products to be received</h2>
					<div>
						{crops.filter((crop) => crop.state === 3).length === 0 && (
							<p>No products to be received</p>
						)}
						{crops
							.filter((crop) => crop.state === 3)
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
										onClick={handleReceive(Number(crop.id))}
									>
										Received
									</button>
								</div>
							))}
					</div>
				</div>
				<div>
					<h2>My products to be processed</h2>
					<div>
						{crops.filter((crop) => crop.state === 4).length === 0 && (
							<p>No products to be processed</p>
						)}
						{crops
							.filter((crop) => crop.state === 4)
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
										onClick={handleProcess(Number(crop.id))}
									>
										Process
									</button>
								</div>
							))}
					</div>
				</div>
				<div>
					<h2>My products to be packed</h2>
					<div>
						{crops.filter((crop) => crop.state === 5).length === 0 && (
							<p>No products to be packed</p>
						)}
						{crops
							.filter((crop) => crop.state === 5)
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
										onClick={handlePack(Number(crop.id))}
									>
										Pack
									</button>
								</div>
							))}
					</div>
				</div>
				<div>
					<h2>My products to be approved</h2>
					<div>
						{crops.filter((crop) => crop.state === 6).length === 0 && (
							<p>No products to be approved</p>
						)}
						{crops
							.filter((crop) => crop.state === 6)
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
										onClick={handleSell(Number(crop.id))}
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
						{crops.filter((crop) => crop.state === 8).length === 0 && (
							<p>No products to be shipped</p>
						)}
						{crops
							.filter((crop) => crop.state === 8)
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

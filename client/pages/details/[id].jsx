import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Swal from 'sweetalert2';
import Layout from '../../src/components/layout';
import { abi, contractaddress } from '../../src/constants';
import useAuth from '../../src/contexts/auth-context';

function CropDetails({ id, bids }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cropDetail, setCropDetail] = useState(null);
	const [bidsArray, setBidsArray] = useState(bids);

	const { refetch, isError, isFetched } = useContractRead({
		args: [id],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getProductById',
	});

	const { write: sellProduct } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [id, bids[0]?.amount || 0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'sellItemByFarmer',
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
					text: 'Bid with price approved',
				});
			}
		},
	});

	const { write: sellByDistributor } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [id, bids[0]?.amount || 0],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'sellItemByDistributor',
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
					text: 'Bid with price approved',
				});
			}
		},
	});

	const { write: buyByDistributor } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [Number(id)],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'purchaseItemByDistributor',
		onSettled: (data, error) => {
			if (error) {
				Swal.fire({
					icon: 'error',
					text: 'Some error occured',
				});
			} else {
				Swal.fire({
					icon: 'success',
					text: 'Product bought',
				});
			}
		},
	});

	const { write: buyByRetailer } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: [Number(id)],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'purchaseItemByRetailer',
		onSettled: (data, error) => {
			if (error) {
				Swal.fire({
					icon: 'error',
					text: 'Some error occured',
				});
			} else {
				Swal.fire({
					icon: 'success',
					text: 'Product bought',
				});
			}
		},
	});

	const { address } = useAccount();

	const { role } = useAuth();

	const handleSell = (productId, price) => () => {
		sellProduct({
			recklesslySetUnpreparedArgs: [productId, price],
		});
	};

	const handleDistributorSell = (productId, price) => () => {
		sellByDistributor({
			recklesslySetUnpreparedArgs: [productId, price],
		});
	};

	const handleDistributorBuy = (productId) => () => {
		console.log(productId);
		buyByDistributor({
			recklesslySetUnpreparedArgs: [Number(productId)],
		});
	};

	const handleRetailerBuy = (productId) => () => {
		console.log(productId);
		buyByRetailer({
			recklesslySetUnpreparedArgs: [Number(productId)],
		});
	};

	const handleDistributorBid = async () => {
		console.log(id);
		await fetch(
			`/api/createbid?user=${address}&productId=${Number(
				id
			)}&type=distributor&amount=${cropDetail.price}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.err) {
					Swal.fire({
						icon: 'error',
						text: 'Something went wrong',
					});
				}
			})
			.catch((err) => {
				Swal.fire({
					icon: 'error',
					text: 'Some error occured',
				});
			});
		const check = bidsArray.find(
			(bid) => bid.user === address && bid.productId === Number(id)
		);
		if (check) {
			Swal.fire({
				icon: 'error',
				text: 'You have already placed a bid',
			});
			return;
		}
		setBidsArray((prev) => [
			...prev,
			{
				type: 'distributor',
				user: address,
				productId: Number(id),
				amount: prev[prev.length]?.amount
					? 1 + prev[prev.length].amount
					: cropDetail.price,
			},
		]);
		Swal.fire({
			icon: 'success',
			text: 'Bid placed successfully',
		});
	};

	const handleRetailerBid = async () => {
		await fetch(
			`/api/createbid?user=${address}&productId=${Number(
				id
			)}&type=retailer&amount=${cropDetail.price}`
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.err) {
					Swal.fire({
						icon: 'error',
						text: 'Something went wrong',
					});
				}
			})
			.catch((err) => {
				Swal.fire({
					icon: 'error',
					text: 'Some error occured',
				});
			});
		setBidsArray((prev) => [
			...prev,
			{
				type: 'retailer',
				user: address,
				productId: Number(id),
				amount: prev[prev.length]?.amount
					? 1 + prev[prev.length].amount
					: cropDetail.price,
			},
		]);
		Swal.fire({
			icon: 'success',
			text: 'Bid placed successfully',
		});
	};

	useEffect(() => {
		refetch(id).then((data) => {
			console.log(data);
			if (data.isError) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Something went wrong!',
				});
			} else {
				console.log(data.data);
				const crop = {
					id: Number(data.data.productIndex._hex),
					name: data.data.name,
					description: data.data.description,
					image: `https://cdn.britannica.com/89/140889-050-EC3F00BF/Ripening-heads-rice-Oryza-sativa.jpg`,
					location: data.data.originFarmInformation,
					price: Number(data.data.productPrice._hex),
					quantity: Number(data.data.quantity._hex),
					state: data.data.itemState,
					farmer: data.data.originFarmerID,
					owner: data.data.ownerID,
					distributor: data.data.distributorID,
					retailer: data.data.retailerID,
				};
				console.log(crop);
				setCropDetail(crop);
			}
			setIsLoading(false);
		});
	}, []);

	return (
		<Layout>
			{!isFetched || isLoading || isError ? (
				<div className='flex justify-center items-center h-screen'>
					<div className='loader ease-linear animate-spin border-8 border-t-8 border-gray-200 h-12 w-12 duration-1000 ease-in-out' />
				</div>
			) : (
				<div className='prose prose-h1:text-4xl w-full max-w-6xl mx-auto'>
					<div className='flex flex-col md:flex-row w-full p-4 bg-neutral '>
						<div className=' w-full md:w-1/2 md:p-10'>
							<img
								className='w-full h-[500px]'
								src={cropDetail.image}
								alt={cropDetail.name}
							/>
						</div>
						<div className='w-full md:w-1/2 md:p-10 md:border-l border-stone-700 '>
							<h1 className='px-2 mb-8'>{cropDetail.name}</h1>
							<div className='mx-auto w-full'>
								<h3 className='px-2'>Description</h3>
								<div className=' w-full px-4 lg:px-0'>
									<p className='my-0 px-2'>{cropDetail.description}</p>
									<div className='flex flex-col justify-between text-xl mt-6 flex-wrap'>
										<span className='border border-primary py-1 px-4 rounded-full m-2'>
											<span className='text-secondary'>Price:</span>{' '}
											{cropDetail.price}
										</span>
										<span className='border border-primary py-1 px-4 rounded-full m-2'>
											<span className='text-secondary'>Quantity:</span>{' '}
											{cropDetail.quantity}
										</span>
										<span className='border border-primary py-1 px-4 rounded-full m-2'>
											<span className='text-secondary'>Location:</span>{' '}
											{cropDetail.location}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='p-4'>
						<h2>Distributor bids</h2>
						{bidsArray
							.filter((item) => item.type === 'distributor')
							.map((item) => (
								<div className='flex justify-between px-6 items-center'>
									<p>
										<span className=' text-secondary font-semibold '>
											{item.user}
										</span>{' '}
										bid for this product for{' '}
										<span className='text-primary underline font-bold'>
											{item.amount}
										</span>{' '}
										per unit
									</p>
									{cropDetail.farmer === address && cropDetail.state === 0 && (
										<button
											className='btn btn-primary'
											onClick={handleSell(Number(id), +item.amount)}
										>
											Approve
										</button>
									)}
								</div>
							))}
						{role === 'distributor' && cropDetail.state === 0 && (
							<button
								className='m-6 px-10 btn btn-primary'
								onClick={handleDistributorBid}
							>
								Bid
							</button>
						)}
						{role === 'distributor' && cropDetail.state === 1 && (
							<button
								className='m-6 px-10 btn btn-primary'
								onClick={handleDistributorBuy(Number(cropDetail.id))}
							>
								Buy
							</button>
						)}
						{cropDetail.state >= 2 && (
							<p className='px-6'>
								Sold to{' '}
								<span className='text-secondary font-semibold'>
									{cropDetail.distributor}
								</span>{' '}
								for{' '}
								<span className='text-primary underline font-bold'>
									{cropDetail.price}
								</span>{' '}
								per unit
							</p>
						)}
					</div>
					<div className='p-4'>
						<h2>Retailer bids</h2>
						{bidsArray
							.filter((item) => item.type === 'retailer')
							.map((item) => (
								<div className='flex justify-between px-6 items-center'>
									<p>
										<span className=' text-secondary font-semibold '>
											{item.user}
										</span>{' '}
										bid for this product for{' '}
										<span className='text-primary underline font-bold'>
											{item.amount}
										</span>{' '}
										per unit
									</p>
									{cropDetail.owner === address && cropDetail.state === 6 && (
										<button
											className='btn btn-primary'
											onClick={handleDistributorSell(Number(id), +item.amount)}
										>
											Approve
										</button>
									)}
								</div>
							))}
						{role === 'retailer' &&
							cropDetail.state >= 2 &&
							cropDetail.state < 7 && (
								<button
									className='m-6 px-10 btn btn-primary'
									onClick={handleRetailerBid}
								>
									Bid
								</button>
							)}
						{role === 'retailer' && cropDetail.state === 7 && (
							<button
								className='m-6 px-10 btn btn-primary'
								onClick={handleRetailerBuy(Number(cropDetail.id))}
							>
								Buy
							</button>
						)}
						{cropDetail.state > 7 && (
							<p className='px-6'>
								Sold to{' '}
								<span className='text-secondary font-semibold'>
									{cropDetail.retailer}
								</span>{' '}
								for{' '}
								<span className='text-primary underline font-bold'>
									{cropDetail.price}
								</span>{' '}
								per unit
							</p>
						)}
					</div>
				</div>
			)}
		</Layout>
	);
}

export default CropDetails;

export async function getServerSideProps(context) {
	const { id } = context.query;
	const result = await fetch(
		`http://localhost:3000/api/getbids?productId=${Number(id)}`
	);
	const bidArray = await result.json();
	console.log(bidArray, 'bidarray');
	return {
		props: {
			id,
			bids: bidArray,
		},
	};
}

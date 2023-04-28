import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import Layout from '../../src/components/layout';
import { abi, contractaddress } from '../../src/constants';
import useAuth from '../../src/contexts/auth-context';

// createdDate
// dateFarmerShipped
// dateDistributorReceived
// dateDistributorShipped
// dateRetailerReceived

function InfoCard({ item }) {
	return (
		!!item.date && (
			<motion.div>
				<h3>{item.title}</h3>
				<p>
					{item.title} by {item.stakeholder} on{' '}
					{new Date(item.date).toLocaleDateString('en-GB')}
				</p>
			</motion.div>
		)
	);
}

InfoCard.prototype = {
	item: PropTypes.object,
}

function CropDetails({ id, bids }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cropDetail, setCropDetail] = useState(null);
	const [bidsArray, setBidsArray] = useState(bids);
	const [timeline, setTimeline] = useState([]);

	const { refetch, isError, isFetched } = useContractRead({
		args: [id],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getProductByIndex',
	});

	const { address } = useAccount();

	const { role } = useAuth();

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
					image: `https://${data.data.productImage}.ipfs.nftstorage.link/file`,
					location: data.data.originFarmInformation,
					price: Number(data.data.productPrice._hex),
					quantity: Number(data.data.quantity._hex),
					state: data.data.itemState,
					farmer: data.data.originFarmerID,
					owner: data.data.ownerID,
					distributor: data.data.distributorID,
					retailer: data.data.retailerID,
					createdDate: Number(data.data.productDate._hex) * 1000,
					dateFarmerShipped: Number(data.data.dateFarmerShipped._hex) * 1000,
					dateDistributorShipped:
						Number(data.data.dateDistributorShipped._hex) * 1000,
					dateDistributorReceived:
						Number(data.data.dateDistributorReceived._hex) * 1000,
					dateRetailerReceived:
						Number(data.data.dateRetailerReceived._hex) * 1000,
				};
				console.log(crop);
				setCropDetail(crop);
				setTimeline([
					{
						date: crop.createdDate,
						title: 'Product Created',
						stakeholder: 'Farmer',
					},
					{
						date: crop.dateFarmerShipped,
						title: 'Product Shipped',
						stakeholder: 'Farmer',
					},
					{
						date: crop.dateDistributorReceived,
						title: 'Product Received',
						stakeholder: 'Distributor',
					},
					{
						date: crop.dateDistributorShipped,
						title: 'Product Shipped',
						stakeholder: 'Distributor',
					},
					{
						date: crop.dateRetailerReceived,
						title: 'Product Received',
						stakeholder: 'Retailer',
					},
				]);
			}
			setIsLoading(false);
		});
	}, []);

	return (
		<Layout>
			{!isFetched || isLoading || isError ? (
				<div className='flex justify-center items-center h-screen'>
					<div className='loader animate-spin border-8 border-t-8 border-gray-200 h-12 w-12 duration-1000 ease-in-out' />
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
					{!!timeline.length &&
						timeline.map((item) => <InfoCard item={item} />)}
				</div>
			)}
		</Layout>
	);
}

export default CropDetails;

CropDetails.propTypes = {
	id: PropTypes.number,
}

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

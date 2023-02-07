import { useContext, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import Swal from 'sweetalert2';
import Layout from '../../src/components/layout';
import { abi, contractaddress } from '../../src/constants';
import useAuth from '../../src/contexts/auth-context';

function CropDetails({ id }) {
	const [isLoading, setIsLoading] = useState(true);
	const [cropDetail, setCropDetail] = useState(null);

	const { refetch, isError, isFetched } = useContractRead({
		args: [id],
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getProductById',
	});

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
				const crop = {
					id: Number(data.data.productIndex._hex),
					name: data.data.name,
					description: data.data.description,
					image: `https://picsum.photos/seed/${data.data.originFarmName}/200/200`,
					location: data.data.originFarmInformation,
					price: Number(data.data.productPrice._hex),
					quantity: Number(data.data.quantity._hex),
					stage: data.data.itemState,
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
							<h1 className='text-center mb-16'>{cropDetail.name}</h1>
							<div className='mx-auto w-full'>
								<div className=' w-full px-4 lg:px-0'>
									<h3 className='text-primary-content my-0'>
										{cropDetail.description}
									</h3>
									<div className='flex items-center justify-between text-xl mt-6 flex-wrap'>
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
					{role === 'ditributor' && cropDetail.state === 0 && (
						<button className='btn btn-primary'>Bid</button>
					)}
					{/* {role === 'retailler' && cropDetail.state === 1 && '} */}
				</div>
			)}
		</Layout>
	);
}

export default CropDetails;

export async function getServerSideProps(context) {
	const { id } = context.query;
	return {
		props: {
			id,
		},
	};
}

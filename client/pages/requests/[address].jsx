import { PrismaClient } from '@prisma/client';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import Layout from '../../src/components/layout';
import { abi, contractaddress } from '../../src/constants';

export default function Requests({ requestArray }) {
	const { isLoading: farmerLoading, write: writeAsFarmer } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: new Array(1).fill(''),
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'addFarmer',
		onSuccess: (data) => {
			Swal.fire({
				title: 'Success',
				text: 'Farmer add request sent',
				icon: 'success',
				confirmButtonText: 'Ok',
			});
		},
		onError: (err) => {
			Swal.fire({
				title: 'Error',
				text: 'Farmer add request failed',
				icon: 'error',
				confirmButtonText: 'Ok',
			});
		},
	});

	const { isLoading: distributorLoading, write: writeAsDistributor } =
		useContractWrite({
			mode: 'recklesslyUnprepared',
			args: new Array(1).fill(''),
			addressOrName: contractaddress,
			contractInterface: abi,
			functionName: 'addDistributor',
			onSettled: (data, error) => {
				if (error) {
					Swal.fire({
						title: 'Error',
						text: 'Distributor add request failed',
						icon: 'error',
						confirmButtonText: 'Ok',
					});
				} else {
					Swal.fire({
						title: 'Success',
						text: 'Distributor add request sent',
						icon: 'success',
						confirmButtonText: 'Ok',
					});
					console.log(data);
				}
			},
		});

	const { isLoading: retailerLoading, write: writeAsRetailer } =
		useContractWrite({
			mode: 'recklesslyUnprepared',
			args: new Array(1).fill(''),
			addressOrName: contractaddress,
			contractInterface: abi,
			functionName: 'addRetailer',
			onSuccess: (data) => {
				Swal.fire({
					title: 'Success',
					text: 'Retailer add request sent',
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			},
			onError: (err) => {
				Swal.fire({
					title: 'Error',
					text: 'Retailer add request failed',
					icon: 'error',
					confirmButtonText: 'Ok',
				});
			},
		});
	const [requests, setRequests] = useState(requestArray);

	const handleRoleAdd = (address, role) => async (e) => {
		e.preventDefault();
		console.log(address, role);
		if (role === 'farmer') {
			await writeAsFarmer({
				recklesslySetUnpreparedArgs: [address],
			});
		} else if (role === 'distributor') {
			await writeAsDistributor({
				recklesslySetUnpreparedArgs: [address],
			});
		} else if (role === 'retailer') {
			writeAsRetailer({
				recklesslySetUnpreparedArgs: [address],
			});
		}
		const res = await fetch(`/api/login?address=${address}&role=${role}`);
		const data = await res.json();
		if (!data.err) {
			Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Role added successfully!',
			});
			setRequests(requests.filter((item) => item.address !== address));
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
		}
	};

	return (
		<Layout>
			<div className='prose prose-h1:text-4xl w-full py-10 max-w-6xl mx-auto'>
				{!!requests.length &&
					requests.map((item) => (
						<div
							key={item.id}
							className='flex items-center justify-between border border-primary rounded-full px-6'
						>
							<p className=''>
								<span className='text-primary font-semibold'>
									{item.address}
								</span>{' '}
								has requested for{' '}
								<span className=' capitalize text-primary font-semibold '>
									{item.role}
								</span>{' '}
								role.
							</p>
							<button
								onClick={handleRoleAdd(item.address, item.role)}
								className='btn btn-primary'
								type='button'
								disabled={
									farmerLoading || distributorLoading || retailerLoading
								}
							>
								Add role
							</button>
						</div>
					))}
				{!requests.length && (
					<h2 className='text-center w-full'>No requests pending</h2>
				)}
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const { address } = context.params;
	const prisma = new PrismaClient();
	const requestArray = await prisma.requests.findMany({
		where: {},
	});
	return {
		props: {
			requestArray,
		},
	};
}

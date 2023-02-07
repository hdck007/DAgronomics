import { PrismaClient } from '@prisma/client';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import Layout from '../../src/components/layout';
import { abi } from '../../src/constants';

export default function Requests({ requestArray }) {

	const farmerConfig = usePrepareContractWrite({
    addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    contractInterface: abi,
    functionName: 'addFarmer',
  })
  const { writeAsync: writeAsFarmer } = useContractWrite(farmerConfig)
  const [requests, setRequests] = useState(requestArray);

	const handleRoleAdd = (address, role) => async (e) => {
		e.preventDefault();
		const res = await fetch(`/api/login?address=${address}&role=${role}`);
		const data = await res.json();
		if (!data.err) {
			Swal.fire({
				icon: 'success',
				title: 'Success',
				text: 'Role added successfully!',
			});
      setRequests(requests.filter((item) => item.address !== address));
		}else{
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
	const result = await fetch(
		`http://localhost:3000/api/login?address=${address}`
	);
	const authenticated = await result.json();

	if (authenticated.role === 'super') {
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
	return {
		redirect: {
			destination: '/',
			permanent: false,
		},
	};
}

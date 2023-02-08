import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Layout from '../src/components/layout';

function Profile() {
	const { isConnected, address } = useAccount();
	const [role, setRole] = useState('farmer');

	const router = useRouter();

	useEffect(() => {
		if (isConnected) {
			fetch(`/api/login?address=${address}`)
				.then((res) => res.json)
				.then((data) => {
					if (data.authenticated) {
						router.push('/listing');
					} else router.push('/signup');
				});
		}
	}, [isConnected]);

	const handleSelectChange = (e) => {
		setRole(e.target.value);
	};

	const handleSubmit = () => {
		fetch(`/api/signup?address=${address}&role=${role}`)
			.then((res) => res.json)
			.then((data) => {
				if (!data.err) {
					Swal.fire({
						icon: 'success',
						title: 'Success',
						text: 'Your request is been recorded!',
					});
					router.push('/listing');
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
				}
			});
	};

	return (
		<Layout>
			<div className='prose mx-auto h-[80vh] flex justify-center items-center'>
				<div className='w-2/3 mx-auto p-10 rounded-md shadow-sm bg-neutral'>
					<h3 className='my-4 px-2'>Signup with a role</h3>
					<select
						onChange={handleSelectChange}
						value={role}
						className='select select-primary w-full max-w-xs'
					>
						<option value='farmer'>Farmer</option>
						<option value='distributor'>Distributor</option>
						<option value='retailer'>Retailer</option>
					</select>
					<button
						type='button'
						className='btn btn-primary w-full mt-4'
						onClick={handleSubmit}
					>
						Signup
					</button>
				</div>
			</div>
		</Layout>
	);
}

export default Profile;

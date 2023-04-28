import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useContractWrite } from 'wagmi';
import Swal from 'sweetalert2';
import Layout from '../src/components/layout';
import InputField from '../src/components/input-component';
import { abi, contractaddress } from '../src/constants';
import useAuth from '../src/hooks/useAuth';

function Create() {
	const [cid, setCid] = useState('');
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();
	useAuth();
	const { isLoading: contractLoading, write } = useContractWrite({
		mode: 'recklesslyUnprepared',
		args: new Array(7).fill(''),
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'produceItemByFarmer',
		onSuccess: (data) => {
			Swal.fire({
				title: 'Success',
				text: 'Product add request sent',
				icon: 'success',
				confirmButtonText: 'Ok',
			});
			reset();
			setCid('');
		},
		onError: (err) => {
			console.error(err);
			Swal.fire({
				title: 'Error',
				text: 'Product add request failed',
				icon: 'error',
				confirmButtonText: 'Ok',
			});
		},
	});

	const onSubmit = (data) => {
		const copyOfData = { ...data };
		try {
			if (cid) {
				console.log([
					data.name,
					data.description,
					+data.quantity,
					data.district,
					data.town,
					data.grade,
					cid,
					+data.price,
				]);
				write({
					recklesslySetUnpreparedArgs: [
						data.name,
						data.description,
						+data.quantity,
						data.district,
						data.town,
						data.grade,
						cid,
						+data.price,
					],
				});
			}
		} catch (err) {
			console.error('The error');
		}
	};

	return (
		<Layout>
			<div className='mx-auto flex flex-col justify-center items-center prose'>
				<h2 className='self-start px-4'>Add product</h2>
				<input
					disabled={contractLoading}
					type='file'
					name='file'
					onChange={async (e) => {
						const formData = new FormData();
						const myFile = new File([e.target.files[0]], 'file');
						console.log(myFile);
						formData.append('file', myFile);
						fetch('https://api.nft.storage/upload', {
							method: 'POST',
							body: formData,
							headers: {
								Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY}`,
							},
						})
							.then((data) => data.json())
							.then((data) => {
								setCid(data.value.cid);
							})
							.catch((err) => {
								console.error(err);
								Swal.fire({
									title: 'Error',
									text: 'Upload failed',
									icon: 'error',
									confirmButtonText: 'Ok',
								});
							});
					}}
				/>
				{!!cid && (
					<>
						<h4>Image preview</h4>
						<img
							src={`https://${cid}.ipfs.nftstorage.link/file`}
							alt='product'
						/>
					</>
				)}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex flex-col justify-around w-full'
				>
					<InputField
						formFields={{ ...register('name', { required: true }) }}
						error={errors.name}
					/>
					<InputField
						formFields={{ ...register('description', { required: true }) }}
						error={errors.description}
					/>
					<InputField
						type='number'
						formFields={{ ...register('quantity', { required: true }) }}
						error={errors.quantity}
					/>
					<InputField
						formFields={{ ...register('district', { required: true }) }}
						error={errors.district}
					/>
					<InputField
						formFields={{ ...register('town', { required: true }) }}
						error={errors.town}
					/>
					<InputField
						formFields={{ ...register('grade', { required: true }) }}
						error={errors.grade}
					/>
					<InputField
						type='number'
						formFields={{ ...register('price', { required: true }) }}
						error={errors.price}
					/>
					<input
						className='btn btn-primary'
						disabled={contractLoading || cid === ''}
						value='Submit'
						type='submit'
					/>
				</form>
			</div>
		</Layout>
	);
}

export default Create;

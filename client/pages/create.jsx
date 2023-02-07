import { useForm } from 'react-hook-form';
import { useContractWrite } from 'wagmi';
import Layout from '../src/components/layout';
import InputField from '../src/components/input-component';
import { abi, contractaddress } from '../src/constants';
import useAuth from '../src/hooks/useAuth';

function Create() {
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
	});

	const onSubmit = (data) => {
		try {
			write({
				recklesslySetUnpreparedArgs: [
					data.name,
					data.description,
					+data.quantity,
					data.district,
					data.town,
					'',
					'',
					data.grade,
					+data.price,
				],
			});
			reset();
		} catch (err) {
			console.error('The error');
		}
	};

	return (
		<Layout>
			<div className='mx-auto flex flex-col justify-center items-center prose'>
				<h2 className='self-start px-4'>Add product</h2>
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
						disabled={contractLoading}
						value='Submit'
						type='submit'
					/>
				</form>
			</div>
		</Layout>
	);
}

export default Create;

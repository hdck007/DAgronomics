import Image from 'next/image';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

function ListComponent({ data }) {
	const router = useRouter();
	return data.length ? (
		<div className='flex flex-wrap justify-around items-center px-4 gap-4'>
			{data.map((crop) => (
				<div
					key={crop.id}
					className='card shadow-2xl rounded-2xl bg-neutral-focus p-2 py-5 flex-grow my-4 min-w-[300px] max-w-[400px]'
				>
					<Image src={crop.image} alt={crop.name} width={200} height={200} />
					<h2 className='card-title px-4'>{crop.name}</h2>
					<div className='flex flex-grow'>
						<span className='border border-primary py-1 px-4 rounded-full m-2'>
							<span className='text-secondary'>Location:</span> {crop.location}
						</span>
					</div>
					<p className='px-4'>{crop.description}</p>
					<button
						type='button'
						className='btn btn-primary'
						onClick={() => {
							router.push(`/details/${Number(crop.id)}`);
						}}
					>
						View
					</button>
				</div>
			))}
			{new Array(3 - (data.length % 3)).fill(0).map((_) => (
				<div key={String(_)} className='my-4 min-w-[360px] max-w-[360px]' />
			))}
		</div>
	) : (
		<h2 className='text-center w-full'>No crops found</h2>
	);
}

ListComponent.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.exact({
			id: PropTypes.number,
			name: PropTypes.string,
			description: PropTypes.string,
			image: PropTypes.string,
			location: PropTypes.string,
		})
	).isRequired,
};

export default ListComponent;

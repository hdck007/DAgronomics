const cropDetail = {
	id: 1,
	name: 'Crop 1',
	description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentiallore recently with `,
	image: [
		'https://picsum.photos/seed/1/400/500',
		'https://picsum.photos/seed/2/400/500',
		'https://picsum.photos/seed/3/400/500',
	],
	price: 100,
	quantity: 100,
	location: 'Ratnagiri',
	latsAndLongs: [73.3, 18.4],
	owner: '0x1234567890',
};

function CropDetails() {
	return (
		<div className='prose prose-h1:text-4xl w-full py-12 max-w-6xl mx-auto'>
			<h1 className='text-center mb-16'>{cropDetail.name}</h1>
			<div className='mx-auto w-full'>
				<div className='w-full bg-red-400'>
					<img
						className='w-full h-[500px]'
						src={cropDetail.image[0]}
						alt={cropDetail.name}
					/>
				</div>
				<div className=' w-full px-4 lg:px-0'>
					<h3 className='text-primary-content my-0'>
						{cropDetail.description}
					</h3>
					<div className='flex items-center justify-between text-xl mt-6 flex-wrap'>
						<span className='border border-primary py-1 px-4 rounded-full m-2'>
							<span className='text-secondary'>Price:</span> {cropDetail.price}
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
	);
}

export default CropDetails;

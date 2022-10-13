import Image from 'next/image';

// generate dummy crops data
const crops = new Array(20).fill(0).map((_, i) => ({
	id: i,
	name: `Crop ${i}`,
	description: `This is a description for crop ${i}`,
	image: `https://picsum.photos/seed/${i}/200/200`,
}));

function Listing() {
	return (
		<div className='prose prose-h1:text-4xl w-full py-10 max-w-6xl mx-auto'>
			<h1 className='text-center'>Listing</h1>
			<div className='flex flex-wrap justify-around items-center px-4 gap-4'>
				{crops.map((crop) => (
					<div
						key={crop.id}
						className='card shadow-2xl rounded-2xl bg-neutral-focus p-2 py-5 flex-grow my-4 min-w-[300px] max-w-[400px]'
					>
						<Image src={crop.image} alt={crop.name} width={200} height={200} />
						<h2 className='card-title'>{crop.name}</h2>
						<p>{crop.description}</p>
						<button type='button' className='btn btn-primary'>
							View
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default Listing;

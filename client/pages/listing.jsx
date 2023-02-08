/* eslint-disable no-underscore-dangle */
import { useContractRead } from 'wagmi';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../src/components/layout';
import ListComponent from '../src/components/listing-component';
import { abi, contractaddress } from '../src/constants';

function Listing() {
	const [crops, setCrops] = useState([]);
	const { refetch } = useContractRead({
		addressOrName: contractaddress,
		contractInterface: abi,
		functionName: 'getProducts',
	});

	useEffect(() => {
		refetch().then((data) => {
			if (data.isError) {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Something went wrong!',
				});
			}
			console.log(data);
			const cropArray = data?.data?.map((item) => ({
				id: item.productIndex._hex,
				name: item.name,
				description: item.description,
				image: `https://cdn.britannica.com/89/140889-050-EC3F00BF/Ripening-heads-rice-Oryza-sativa.jpg`,
				location: item.originFarmInformation,
			}));
			if (cropArray) {
				setCrops(cropArray);
			}
		});
	}, []);

	return (
		<Layout>
			<div className='prose prose-h1:text-4xl w-full py-10 max-w-6xl mx-auto'>
				<ListComponent data={crops} />
			</div>
		</Layout>
	);
}

export default Listing;

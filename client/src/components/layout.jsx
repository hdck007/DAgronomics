import Navbar from './navbar';

export default function Layout({ children }) {
	return (
		<>
			<Navbar />
			<main className='min-h-[90vh] py-2'>
				{children}
			</main>
		</>
	);
}

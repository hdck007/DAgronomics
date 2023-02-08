// prisma client import
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req, res) => {
	const { productId } = req.query;
	if (!productId) {
		res.status(400).json({ message: 'Bad request', err: true });
	}

	try {
		console.log(productId, 'product id here');
		const results = await prisma.bidrequests.findMany({
			where: {
				productId: Number(productId),
			},
		});
		res.status(200).json(results);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Some error occured', err: true });
	}
};

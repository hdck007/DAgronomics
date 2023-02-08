// prisma client import
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async (req, res) => {
	const { user, type, productId } = req.query;
	if (!user || !type || !productId) {
		res.status(400).json({ message: 'Bad request', err: true });
	}

	try {
		const currentbid = await prisma.bidrequests.findFirst({
			where: {
				productId: Number(productId),
			},
		});
		let amount;
		if (currentbid) {
			amount = currentbid.amount + 1;
		} else {
			amount = Number(req.query.amount);
		}
		await prisma.bidrequests.deleteMany({
			where: {
				productId: +productId,
				type,
			},
		});
		console.log(amount);
		await prisma.bidrequests.create({
			data: {
				user,
				type,
				productId: +productId,
				amount,
			},
		});
		res.status(200).json({ msg: 'request created succesfully', err: false });
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Some error occured', err: true });
	}
};

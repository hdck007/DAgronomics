// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export default async (req, res) => {
	try {
		await prisma.requests.create({
			data: {
				address: req.query.address,
				role: req.query.role,
			},
		});
		res.status(200).json({ message: 'Request added', err: false });
	} catch (err) {
		console.log(err);
		res.status(200).json({ message: err, err: true });
	}
};

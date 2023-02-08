// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export default async (req, res) => {
	if (!req.query.address) {
		res.status(200).json({
			authenticated: false,
			message: 'No address provided',
			err: true,
		});
		return;
	}
	try {
		if (req.query.role) {
			console.log('request fullfilled');
			await prisma.requests.deleteMany({
				where: {
					address: req.query.address,
				},
			});
			res.status(200).json({ err: false, msg: 'user and role added' });
		} else {
			res.status(500).json({ err: true, msg: 'no query' });
		}
	} catch (err) {
		res.status(500).json({ err: true, msg: 'error', err: err.message });
	}
};

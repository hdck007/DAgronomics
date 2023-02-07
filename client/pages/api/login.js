// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export default async (req, res) => {
	if (!req.query.address) {
		res
			.status(200)
			.json({
				authenticated: false,
				message: 'No address provided',
				err: true,
			});
		return;
	}
	try {
		const user = await prisma.users.findFirst({
			where: {
				address: req.query.address,
			},
		});
		if (user?.role) {
			res
				.status(200)
				.json({ authenticated: true, message: 'User found', role: user.role });
		} else if (req.query.role) {
			await prisma.users.create({
				data: {
					address: req.query.address,
					role: req.query.role,
				},
			});
      await prisma.requests.deleteMany({
        where: {
          address: req.query.address,
        },
      });
			res.status(200).json({ err: false, msg: 'user and role added' });
		}
	} catch (err) {
		res.status(200).json({ err: true, msg: 'error', err: err.message });
	}
};

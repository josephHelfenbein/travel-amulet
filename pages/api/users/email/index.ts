import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {id} = req.query;
    const email = id.toString();
    const user = await prisma.user.findUnique({where: {email:email}});
    return user ? res.send(user) : res.status(400).end();
}
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {newQuery} = req.query;
    const email = newQuery?.toString();
    const user = await prisma.user.findFirst({where: {email: email,}});
    
    return user ? res.send(user) : res.status(400).end();
}
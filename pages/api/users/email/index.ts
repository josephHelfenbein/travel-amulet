import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const email = req.query.toString();
    const user = await prisma.user.findUnique({where: {email:email}});
    return user ? true:false;
}
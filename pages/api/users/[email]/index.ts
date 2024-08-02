import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {emailReq} = req.query;
    const emailStr = emailReq?.toString();
    if (!emailStr) return res.status(404).end();
    const user = await prisma.user.findUnique({
        where: {
          email: emailStr,
        },
      });
    return user ? res.send(user) : res.status(404).end();
}
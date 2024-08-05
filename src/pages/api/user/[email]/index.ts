import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../../lib/prisma';
import exclude from '../auth';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {email} = req.query;
    const emailStr = email?.toString();
    if(emailStr == undefined) return res.status(410).end();
    const user = await prisma.user.findUnique({
        where: {
          email: emailStr,
        },
      });
    return user ? res.send(exclude(user, ["password"])) : res.status(410).end();
}
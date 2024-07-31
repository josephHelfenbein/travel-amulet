import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method === 'GET'){
        const users = await prisma.user.findMany();
        return res.send(users);
    } else if(req.method==='POST'){
        const {body: data} = req;
        const newUser = await prisma.user.create({data});
        return res.status(201).end(newUser);
    }
}
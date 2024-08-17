import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../../lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { id } = req.query;
        const idStr = id?.toString();
        if (idStr == undefined) return res.status(410).end();
        const country = await prisma.countryData.findUnique({
            where: { id: idStr }
        });
        return country ? res.status(200).json(country) : res.status(410).end();
    }
}
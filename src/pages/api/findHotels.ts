import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method === 'GET'){
        const { query } = req.query;

        axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: `Hotels in ${query}`,
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
            }
        }).then((response) => {
            let hotels = response.data.results;
            return res.status(200).json(hotels);
        }).catch((error) => {
            return res.status(410).end();
        });
    }
}


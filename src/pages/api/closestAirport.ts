import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import {headers} from 'next/headers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method === 'GET'){
        let params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("client_id", `${process.env.AMADEUS_KEY}`);
        params.append("client_secret", `${process.env.AMADEUS_SECRET}`);
        const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token",{
            method: "POST",
            body: params,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
              }
        });
        const token = await response.json();
        const accessToken = token.access_token;
        if(!accessToken) {
            console.error("Failed to retrieve access token");
            return res.status(500).end();
        }
        const { query } = req.query;
        if(!query||query=="") return res.status(410).end();
        const location = JSON.parse(query!.toString());
        
        axios.get('https://test.api.amadeus.com/v1/reference-data/locations/airports', {
            params: {
                latitude: location.lat,
                longitude: location.lng,
                radius: 500,
                'page[limit]': 1,
                'page[offset]': 0,
                sort: 'relevance'
            },
            headers:{
                'Authorization': `Bearer ${accessToken}`
            }
        }).then((response) => {
            let places = response.data;
            return res.status(200).json(places);
        }).catch((error) => {
            return res.status(410).end();
        });
    }
}


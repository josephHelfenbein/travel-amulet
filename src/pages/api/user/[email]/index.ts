import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../../../lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
  if(req.method === 'GET'){
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
  else if(req.method === 'PUT'){
    const {email, country, name} = req.body;
    const emailStr = email?.toString();
    const countryStr = country?.toString();
    const nameStr = name?.toString();
    if(emailStr == undefined) return res.status(405).end();
    let newUser;
    if(nameStr){
      newUser = await prisma.user.update({
        where: {
          email:emailStr,
        },
        data: {
          name: nameStr,
        },
      });
      return newUser ? res.status(200).json(exclude(newUser, ["password"])) : res.status(410).end();
    }
    else if(countryStr){
      newUser = await prisma.user.update({
        where: {
          email:emailStr,
        },
        data: {
          country:countryStr,
        },
      });
      return newUser ? res.status(200).json(exclude(newUser, ["password"])) : res.status(410).end();
    }
    else return res.status(401).end(); 
  }
}
function exclude(user:any, keys:any){
  for (let key of keys){
      delete user[key];
  }
  return user;
}
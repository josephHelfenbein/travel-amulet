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
    const {email, variable, value} = req.query;
    const emailStr = email?.toString();
    const variableStr = variable?.toString();
    const valueStr = value?.toString();
    if(emailStr == undefined) return res.status(410).end();
    let newUser;
    if(variableStr === 'country')
      newUser = await prisma.user.update({
        where: {
          email:emailStr,
        },
        data: {
          country: valueStr,
        },
      });
    else if(variableStr === 'name')
      newUser = await prisma.user.update({
        where: {
          email:emailStr,
        },
        data: {
          name: valueStr,
        },
      });
    return newUser ? res.send(exclude(newUser, ["password"])) : res.status(410).end();
  }
}
function exclude(user:any, keys:any){
  for (let key of keys){
      delete user[key];
  }
  return user;
}
import { NextApiRequest, NextApiResponse } from 'next';
import { SHA256 as sha256} from "crypto-js";
import prisma from '../../../../lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method === 'GET'){
        const users = await prisma.user.findMany();
        users.forEach(user => {
            user = exclude(user, ["password"]);
        });
        return res.send(users);
    } else if(req.method==='POST'){
        createUserHandler(req, res);
    }
}
export const hashPassword = (string:string) => {
    return sha256(string).toString();
};
async function createUserHandler(req: NextApiRequest, res: NextApiResponse){
    const {name, email, password, country, preferences, results} = req.body;
    try{
        const user = await prisma.user.create({
            data: {...req.body, password:hashPassword(req.body.password)},
        });
        return res.status(201).json(exclude(user, ["password"]));
    } catch (e){
        if(e instanceof Prisma.PrismaClientKnownRequestError){
            if(e.code === "P2002") return res.status(400).json({message:e.message});
            return res.status(400).json({message:e.message});
        }
    }
}
function exclude(user:any, keys:any){
    for (let key of keys){
        delete user[key];
    }
    return user;
}
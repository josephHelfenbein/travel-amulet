import { SHA256 as sha256 } from "crypto-js";
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res:NextApiResponse){
    if(req.method === "POST"){
        await loginUserHandler(req, res);
    } else return res.status(405);
}
async function loginUserHandler(req: NextApiRequest, res:NextApiResponse){
    const {email, password} = req.body.userCredentials;
    if(!email || !password) return res.status(400).json({message: "invalid inputs"});
    try{
        const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });
        if(user && user.password === hashPassword(password))
            return res.status(200).json(exclude(user, ["password"]));
        else return res.status(401).json({message: "invalid credentials"});
    }catch (e) {
        console.log(e);
        throw e;
    }
}
function exclude(user:any, keys:any){
    for (let key of keys){
        delete user[key];
    }
    return user;
}
const hashPassword = (string:string) => {
    return sha256(string).toString();
};
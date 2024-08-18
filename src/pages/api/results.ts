import prisma from '../../../lib/prisma';
export default async function handler(req, res) {
        const {country, email} = req.body;
        const emailStr = email.toString();
        const countryStr = country.toString();
        let newUser;
        let updatedUser;
        if(emailStr && countryStr){
            newUser= await prisma.user.findUnique({
                where:{email:emailStr}
            });
            if(newUser){
                if(newUser.results.substring(newUser.results.length-2, newUser.results.length) !== countryStr){
                    if(newUser.results.length == 254) 
                        newUser.results = newUser.results.substring(2, newUser.results.length-1);
                    newUser.results += countryStr;
                    updatedUser = await prisma.user.update({
                        where:{email:emailStr},
                        data:{results:newUser.results}
                    });
                }
                
            }
        return updatedUser ? res.status(200).end() : res.status(410).end();
    }
}
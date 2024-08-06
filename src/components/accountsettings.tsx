import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState } from "react";
import { getSession } from "next-auth/react";
export default function AccountSettings(){
    const router = useRouter();
    const {data:session, status} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [name, setName] = useState('');
    async function sessionUser () {
        const sessionGot = await getSession();
        console.log(session?.user);
        console.log(session);
        console.log(sessionGot?.user);
        console.log(sessionGot);
    }
    sessionUser();
    
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
        </div>
    );
}
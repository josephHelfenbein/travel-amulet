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
    const newSession = getSession();
    newSession.then((obj) => {console.log(obj?.user?.name);console.log(obj);});
    
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
        </div>
    );
}
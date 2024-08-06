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
    console.log('1. ' + session);
    console.log('2. ' + session?.user);
    console.log('3. ' + session?.user?.name);
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
        </div>
    );
}
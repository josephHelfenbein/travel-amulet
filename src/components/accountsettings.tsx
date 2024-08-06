import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState } from "react";

export default function AccountSettings(){
    const router = useRouter();
    const {data, status} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [name, setName] = useState('');
    async function sessionUser () {
        setName(data?.user?.name!);
        console.log(data?.user);
        console.log(data);
    
    }
    sessionUser();
    
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
        </div>
    );
}
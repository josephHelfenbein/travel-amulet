'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState } from "react";

export default function AccountSettings(){
    const router = useRouter();
    const {data:session, status} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    let nameSession;
    let emailSession;
    if(session && session.user) {
        nameSession = session.user.name;
        emailSession = session.user.email;
    }
    console.log(nameSession);
    console.log(session?.user);
    console.log(session);
    const [name, setName] = useState(nameSession);
    
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
        </div>
    );
}
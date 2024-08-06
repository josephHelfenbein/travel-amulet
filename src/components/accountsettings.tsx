'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import axios from "axios";

export default function AccountSettings(){
    const router = useRouter();
    const {data, status} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [session, setSession] = useState('');
    useEffect(() => {
        axios.get('/api/auth/session').then((res) =>{
            setSession(res.data.session.user.name);
            console.log(res.data.session);
            console.log(res.data.session.user);
        })
    }, []);

    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {session}</h1>
        </div>
    );
}
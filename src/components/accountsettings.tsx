'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import { fetchServerResponse } from "next/dist/client/components/router-reducer/fetch-server-response";

export default function AccountSettings(){
    const router = useRouter();
    const {data, status} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [session, setSession] = useState(data);
    useEffect(() => {
        const fetchSession = async () => {
            const response = await fetch('/api/auth/session');
            const session = await response.json();
            setSession(session);
        };
        fetchSession();
    }, []);


    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {session?.user?.name}</h1>
        </div>
    );
}
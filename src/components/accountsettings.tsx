'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import axios from "axios";
import {fetchUserByEmail} from '../../lib/http';
import { User } from "@prisma/client";

export default function AccountSettings(){
    const router = useRouter();
    const {data, status} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [name, setName] = useState('');
    let fullUser;
    const [userObj, setUser] = useState<User|null>(null);
    useEffect(() => {
        axios.get('/api/auth/session').then((res) =>{
            setName(res.data.session.user.name);
            fetchUserByEmail(res.data.session.user.email).then((user) => {
                setUser(user.content);
                
                console.log(user.content);
            });
        })
    }, []);
    console.log(userObj);
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
        </div>
    );
}
'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import axios from "axios";
import {fetchUserByEmail, changeUserValue} from '../../lib/http';
import { User } from "@prisma/client";
import { Form, Formik, FormikHelpers, Field } from "formik";
import FormikSelect from "./FormikSelect";
import { countryOptions } from "./signup-form";
import validationSchema from "./validationSchema";

export default function AccountSettings(){
    const router = useRouter();
    const {data, status, update} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [name, setName] = useState('');
    const [user, setUser] = useState<User|null>(null);
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        axios.get('/api/auth/session').then(async (res) =>{
            if(res){
                setName(res.data.session.user.name);
                setEmail(res.data.session.user.email);
                axios.get(`/api/user/${email}`).then(async (userRes) =>{
                    if(userRes){
                        console.log(userRes);
                        console.log(userRes.data.user);
                        console.log(userRes.data.user.country);
                        setCountry(userRes.data.user.country);
                        setUser(userRes.data.user);
                        console.log(country);
                    }
                })
            }
        })
    }, []);
    

    interface Values{
        name: string;
        singleSelect: string;
    }
    return (
        <div className='card p-5'>
            <h1 className="display-6 mb-3">Hello, {name}</h1>
            <p className="m-2">Email: {email}</p>
            <Formik
                initialValues={{
                    singleSelect: `${country}`,
                    name: `${name}`,
                }}
                validationSchema={validationSchema}
                
                onSubmit={ (values: Values,
                    { setSubmitting }: FormikHelpers<Values>
                ) => {setTimeout(
                    (async () => {
                        if(name !== values.name){
                            changeUserValue(email, 'name', name);
                            update({name:name});
                        }
                        if(country !== values.singleSelect)
                            changeUserValue(email, 'country', country);

                        if(name==values.name&&country==values.singleSelect)
                            setError('Nothing was changed!')
                        else
                            setError('Updated!');
                        setSubmitting(false);
                    }), 500);
                }}
            >
                <Form>
                    <div className='mb-3'>
                        <FormikSelect
                            name="singleSelect"
                            label="Country..."
                            options={countryOptions}
                        />
                    </div>
                    <div className="form-floating mb-3">
                        <Field className="form-control" id="name" name="name" placeholder="Name" value={name} />
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className='col-md-8'>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                    {error != '' &&
                    <p>{error}</p>
                    }
                </Form>
                
            </Formik>
        </div>
    );
}
'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import axios from "axios";
import {changeUserName, changeUserCountry} from '../../lib/http';
import { Form, Formik, FormikHelpers, Field } from "formik";
import FormikSelect from "./FormikSelect";
import { countryOptions } from "./countryoptions";
import validationSchema from "./validationSchema";
import styles from './login-form.module.css';

export default function AccountSettings(){
    const router = useRouter();
    const {data, status, update} = useSession({
        required:true,
        onUnauthenticated() {
            router.push('/login');
        },
    });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        axios.get('/api/auth/session').then(async (res) =>{
            if(res){
                setName(res.data.session.user.name);
                setEmail(res.data.session.user.email);
                const userRes = await axios.get(`/api/user/${res.data.session.user.email}`)
                const countryStr = userRes.data.country;
                setCountry(countryStr);
            }
        })
    }, []);

    interface Values{
        name: string;
        singleSelect: string;
    }
    return (
        <div className={styles.account_box}>
            <div className='d-flex mb-5 justify-content-center'>
            <h1 className="bd-highlight display-6" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Hello, {name}</h1>
                <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="48px" >
                    <path d="m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z"></path>
                </svg>
            </div>
            <p className="m-2 mb-4">Email: {email}</p>
            <Formik
                enableReinitialize
                initialValues={{
                    singleSelect: `${country}`,
                    name: `${name}`,
                }}
                validationSchema={validationSchema}
                
                onSubmit={ (values: Values,
                    { setSubmitting }: FormikHelpers<Values>
                ) => {setTimeout(
                    (async () => {
                        if(name===values.name&&country===values.singleSelect)
                            setError('Nothing was changed!');
                        else{
                            if(country !== values.singleSelect){
                                const changed = await changeUserCountry({email:email, country:values.singleSelect});
                                if (changed){
                                    setError('Updated!');
                                }
                            }
                            if(name !== values.name){
                                const changed = await changeUserName({email:email, name:values.name});
                                if(changed){
                                    const newSession = {
                                        ...data,
                                        user:{
                                            ...data?.user,
                                            name: values.name
                                        },
                                    };
                                    await update(newSession);
                                    setError("Updated! You'll have to log in again to see changes to your name.");
                                }
                            }
                        }   
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
                    <div className={styles.extraInputForm + " form-floating mb-3"}>
                        <Field className={styles.inputForm+" form-control"} id="name" name="name" placeholder="Name" />
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className='row g-0 justify-content-center mt-5'>
                        <button type="submit" className={styles.saveButton+" btn btn-success"}>Save</button>
                    </div>
                    {error != '' &&
                    <p>{error}</p>
                    }
                </Form>
                
            </Formik>
        </div>
    );
}
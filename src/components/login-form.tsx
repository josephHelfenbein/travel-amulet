import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
import { fetchUserExistsEmail } from 'lib/http';
import { signIn } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
interface Values{
    username: string;
    password: string;
}
export default function LoginForm() {
    const [error, setError] = useState('');
    const router = useRouter();
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=> {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
            setOnMobile(true);
    })
    const {data:session, status} = useSession();
    if(status === "authenticated") router.push("/");
    return (
        <div className={styles.login_box}>
            <div className='d-flex mb-5 justify-content-center'>
                {!onMobile && <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="48px" >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"></path>
                </svg>}
                {onMobile && <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="38px" >
                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"></path>
                </svg>}
                <h1 className="bd-highlight display-6" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Login</h1>
            </div>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                onSubmit={(values: Values,
                    { setSubmitting }: FormikHelpers<Values>
                ) => {
                    setTimeout((async () => {
                        let userExists = await fetchUserExistsEmail(values.username);
                        if(userExists.error) setSubmitting(false);
                        if(userExists.content) {
                            // check credentials
                            let res = await signIn("credentials", {
                                email:values.username,
                                password:values.password,
                                callbackUrl: `/`,
                                redirect:false,
                            });
                            if(res?.ok){
                                console.log("logged in");
                                router.push("/");
                                return;
                            }
                            else {
                                setError('The password you entered is invalid. Try again.');
                                console.log("Failed", res);
                            }
                            return res;
                        }
                        else setError('An account with this email cannot be found.');
                        setSubmitting(false);
                    }), 500);
                }}
            >
                <Form>
                    <div className="form-floating mb-3">
                        <Field className={styles.inputForm+" form-control"} id="username" name="username" placeholder="Email" type="email" aria-describedby="usernameHelp" required/>
                        <label htmlFor="username">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <Field className={styles.inputForm+" form-control"} type="password" id="password" name="password" placeholder="Password" required/>
                        <label htmlFor="password">Password</label>
                    </div>
                    {error != '' &&
                    <p className='Error'>{error}</p>
                    }
                    {!onMobile &&
                        <div className='row g-0 justify-content-between mt-4'>
                            <div className='col'>
                                <a href='./signup' id={styles.secondary} className={styles.buttonLogin+" btn btn-secondary"}>Sign Up</a>
                            </div> 
                            <div className='col'>
                                <button type="submit" id={styles.primary} className={styles.buttonLogin+" btn btn-success"}>Login</button>
                            </div>
                        </div>
                    }
                    {onMobile &&
                        <div className='row g-0 justify-content-between mt-4'>
                            <div className='col'>
                                <a href='./signup' style={{width:'110px'}} id={styles.secondary} className={styles.buttonLogin+" btn btn-secondary"}>Sign Up</a>
                            </div> 
                            <div className='col'>
                                <button type="submit" style={{width:'110px'}}id={styles.primary} className={styles.buttonLogin+" btn btn-success"}>Login</button>
                            </div>
                        </div>
                    }

                </Form>
            </Formik>
        </div>
        
    )
}
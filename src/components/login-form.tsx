import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
import { fetchUserExistsEmail } from 'lib/http';
import { signIn } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { useSession, getSession } from 'next-auth/react';

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

    const testSession = getSession();
    const testUser = session?.user;
    console.log(testUser);


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
                    <button type="button" onClick={async ()=>{
                    await signIn("google", {callbackUrl: `/api/auth/callback/google`,});
                }} style={{width:'265px'}} id={styles.google} className={styles.buttonLogin+" btn btn-primary mt-3"}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight:"5px"}} height="24" viewBox="0 0 24 24" >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Or, Sign in with Google</button>

                </Form>
            </Formik>
        </div>
        
    )
}
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
        <div className={styles.login_box + ' p-5 '}>
            <h1 className="display-6 mb-3">Login</h1>
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
                        <Field className="form-control" id="username" name="username" placeholder="Email" type="email" aria-describedby="usernameHelp" required/>
                        <label htmlFor="username">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <Field className="form-control" type="password" id="password" name="password" placeholder="Password" required/>
                        <label htmlFor="password">Password</label>
                    </div>
                    {error != '' &&
                    <p className='Error'>{error}</p>
                    }
                    {!onMobile &&
                        <div className='row g-3 justify-content-around'>
                            <div className='col-md-4'>
                                <button type="submit" className="btn btn-success">Login</button>
                            </div>
                            <div className='col-md-5'>
                                <a href='./signup' className="btn btn-secondary">Sign Up</a>
                            </div> 
                        </div>
                    }
                    {onMobile &&
                        <div className='row g-3 justify-content-around'>
                            <div className='col-6'>
                                <button type="submit" className="btn btn-success">Login</button>
                            </div>
                            <div className='col-6'>
                                <a href='./signup' className="btn btn-secondary">Sign Up</a>
                            </div> 
                        </div>
                    }

                </Form>
            </Formik>
        </div>
        
    )
}
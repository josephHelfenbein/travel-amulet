import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
import { fetchUserExistsEmail } from 'lib/http';
import { signIn } from "next-auth/react";
import React, { useState } from 'react';
import { useRouter } from "next/router";

interface Values{
    username: string;
    password: string;
}
export default function LoginForm() {
    const [error, setError] = useState('');
    const router = useRouter();
    return (
        <div className={styles.login_box + ' card p-5 '}>
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
                                email:values.username.toString(),
                                password:values.password.toString(),
                                callbackUrl: `${process.env.NEXTAUTH_URL}`,
                                redirect:false,
                            });
                            if(res?.ok){
                                console.log("logged in");
                                router.push("/");
                                return;
                            }
                            else setError('The password you entered is invalid. Try again.');
                            console.log("Failed", res);
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
                    
                    <div className='row g-3'>
                        <div className='col-md-8'>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <div className='col-md-4'>
                            <a href='./signup'>Sign Up</a>
                        </div> 
                    </div>
                    
                    

                </Form>
            </Formik>
        </div>
        
    )
}
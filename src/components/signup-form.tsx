import styles from './login-form.module.css';
import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import FormikSelect from "./FormikSelect";
import validationSchema from "./validationSchema";
import {useState, useEffect} from 'react';
import { countryOptions } from './countryoptions';
import { fetchUserExistsEmail, postUser } from 'lib/http';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';

interface Values{
    username: string;
    password: string;
    name: string;
    singleSelect: string;
}
const SignUpForm = () => {
    const [error, setError] = useState('');
    const router = useRouter();
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=> {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
            setOnMobile(true);
    })
    const {data:session, status} = useSession();
    if(status === "authenticated") router.push("/");
    return (<div className={styles.login_box}>
        <div className='d-flex mb-5 justify-content-center'>
                {!onMobile && <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="48px" >
                    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"></path>
                </svg>}
                {onMobile && <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="38px" >
                    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"></path>
                </svg>}
                <h1 className="bd-highlight display-6" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Sign Up</h1>
            </div>
        <Formik
            initialValues={{
                username: '',
                singleSelect: '',
                name: '',
                password: '',
            }}
            validationSchema={validationSchema}

            onSubmit={ (values: Values,
                { setSubmitting }: FormikHelpers<Values>
            ) => {
                setTimeout(
                (async () => {
                    let userExists = await fetchUserExistsEmail(values.username);
                    if(userExists.error){
                        setSubmitting(false);
                    }
                    if(userExists.content) setError('Account already exists.');
                    else {
                        let userPost = await postUser({name: values.name, email: values.username, country: values.singleSelect, password:values.password, preferences:'', results:''});
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
                    setSubmitting(false);
                }), 500);
            }}
        >
            <Form>
                <div className="form-floating mb-3">
                    <Field className={styles.inputForm+" form-control"} id="name" name="name" placeholder="Name" required/>
                    <label htmlFor="name">Name</label>
                </div>

                <div className='mb-3'>
                    <FormikSelect
                        name="singleSelect"
                        label="Country..."
                        options={countryOptions}
                    />
                </div>
                

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
                            <a href='./login' id={styles.secondary} className={styles.buttonLogin+" btn btn-secondary"}>Login</a>
                        </div> 
                        <div className='col'>
                            <button type="submit" id={styles.primary} className={styles.buttonLogin+" btn btn-primary"}>Sign Up</button>
                        </div>
                    </div>
                }
                {onMobile &&
                    <div className='row g-0 justify-content-between mt-4'>
                        <div className='col'>
                            <a href='./login' style={{width:'110px'}} id={styles.secondary} className={styles.buttonLogin+" btn btn-secondary"}>Login</a>
                        </div> 
                        <div className='col'>
                            <button type="submit" style={{width:'110px'}} id={styles.primary} className={styles.buttonLogin+" btn btn-primary"}>Sign Up</button>
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
                    Sign in with Google</button>
            </Form>
        </Formik>
    </div>);
}

export default SignUpForm;
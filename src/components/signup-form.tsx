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
                
            </Form>
        </Formik>
    </div>);
}

export default SignUpForm;
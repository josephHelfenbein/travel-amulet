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
    return (<div className={styles.login_box + ' p-5 '}>
        <h1 className="display-6 mb-3">Sign Up</h1>
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
                    <Field className="form-control" id="name" name="name" placeholder="Name" required/>
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
                        <div className='col-md-6'>
                            <button type="submit" className="btn btn-success">Sign Up</button>
                        </div>
                        <div className='col-md-4'>
                            <a href='./login' className="btn btn-secondary">Login</a>
                        </div> 
                    </div>
                }
                {onMobile &&
                    <div className='row g-3 justify-content-around'>
                        <div className='col-6'>
                            <button type="submit" className="btn btn-success">Sign Up</button>
                        </div>
                        <div className='col-6'>
                            <a href='./login' className="btn btn-secondary">Login</a>
                        </div> 
                    </div>
                }
                
            </Form>
        </Formik>
    </div>);
}

export default SignUpForm;
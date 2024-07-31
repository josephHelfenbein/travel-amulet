import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
interface Values{
    username: string;
    password: string;
}
export default function LoginForm() {
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
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 500);
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
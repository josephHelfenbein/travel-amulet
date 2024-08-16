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

const countriesMap = new Map();
for(let i=0; i<countryOptions.length; i++){
    const newName = countryOptions[i].label.substring(0, countryOptions[i].label.length);
    countriesMap.set(countryOptions[i].value, newName);
}
function countryCodeToName(code:string){
    return countriesMap.get(code);
}
function resultsList(results:string){
    let returnList = [<div></div>];
    for(let i=0; i<results.length; i+=2){
        returnList.push(
            <div style={{backgroundColor:'#fefefe', borderRadius: '10px', borderStyle: 'solid', border: '2px solid #e4e4e4'}} className="mb-1 m-3 p-3">
                <p className='mb-1'>{countryCodeToName(results.substring(i, i+2))}</p>
            </div>
        )
    }
    return returnList;
}

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

    const [showResults, setResultsShow] = useState(false);
    const [results, setResults] = useState('');
    useEffect(() => {
        axios.get('/api/auth/session').then(async (res) =>{
            if(res){
                setName(res.data.session.user.name);
                setEmail(res.data.session.user.email);
                const userRes = await axios.get(`/api/user/${res.data.session.user.email}`)
                const countryStr = userRes.data.country;
                setCountry(countryStr);
                const resultsStr = userRes.data.results;
                setResults(resultsStr);
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
                    <p className="mt-2">{error}</p>
                    }
                     <div style={{backgroundColor:'#fefefe', borderRadius: '10px', borderStyle: 'solid', border: '2px solid #e4e4e4'}} className="mb-1 m-3 p-3">
                    <a onClick={()=>{
                        setResultsShow(!showResults);
                    }} className='d-flex justify-content-center p-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e08550" height="52px" >
                            <path d="M440-760v-160h80v160h-80Zm266 110-56-56 113-114 56 57-113 113Zm54 210v-80h160v80H760Zm3 299L650-254l56-56 114 112-57 57ZM254-650 141-763l57-57 112 114-56 56Zm-14 450h180q25 0 42.5-17.5T480-260q0-25-17-42.5T421-320h-51l-20-48q-14-33-44-52.5T240-440q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T40-320q0-83 58.5-141.5T240-520q60 0 109.5 32.5T423-400q58 0 97.5 43T560-254q-2 57-42.5 95.5T420-120H240Zm320-134q-5-20-10-39t-10-39q45-19 72.5-59t27.5-89q0-66-47-113t-113-47q-60 0-105 39t-53 99q-20-5-41-9t-41-9q14-88 82.5-144T480-720q100 0 170 70t70 170q0 77-44 138.5T560-254Zm-79-226Z"></path>
                    </svg>
                    <h5  className="bd-highlight p-2" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Previous Results</h5>
                    {!showResults && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#a0a0a0" height="32px" >
                            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"></path>
                    </svg>}
                    {showResults && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#a0a0a0" height="32px" >
                            <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"></path>
                    </svg>}
                    </a>
                    {showResults && 
                        resultsList(results)
                        }
                    </div>
                </Form>
                
            </Formik>
        </div>
    );
}
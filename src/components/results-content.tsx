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
import {fetchCountryData} from '../../lib/http';

const countriesMap = new Map();
for(let i=0; i<countryOptions.length; i++){
    const newName = countryOptions[i].label.substring(0, countryOptions[i].label.length-5);
    countriesMap.set(countryOptions[i].value, newName);
}
function countryCodeToName(code:string){
    return countriesMap.get(code);
}

// temporary random country before AI chosen country functionality is finished
function randomCountry(){
    const index = Math.round(Math.random()*countryOptions.length);
    return countryOptions[index];
}

export default function ResultsContent(){
    const router = useRouter();
    const {data, status} = useSession({
        required:true,
        onUnauthenticated() {
            setError('You can save your progress if you log in.');
        },
    });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [error, setError] = useState('');
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=> {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
            setOnMobile(true);
    })
    useEffect(() => {
        axios.get('/api/auth/session').then(async (res) =>{
            if(res){
                setEmail(res.data.session.user.email);
                setName(', '+res.data.session.user.name);
                const userRes = await axios.get(`/api/user/${res.data.session.user.email}`);
                const countryStr = userRes.data.country;

                setCountry(countryStr);
            }
        }).catch(error => {
            console.log('Not logged in');
        })
    }, []);
    const [foundCountry, setFoundCountry] = useState('');
    const [description, setDesc] = useState('');
    const [climate, setClimate] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [culture, setCulture] = useState('');
    const [currency, setCurrency] = useState('');
    const [language, setLanguage] = useState('');
    const [politics, setPolitics] = useState('');
    useEffect(()=>{
        setFoundCountry(randomCountry().value);
    }, []);
    useEffect(()=>{
        if(foundCountry!=='')
        fetchCountryData(foundCountry).then(async(res)=>{
            if(res.content){
                let bufferItem = res.content.description;
                let bufferString = Buffer.from(bufferItem).toString('utf-8');
                setDesc(bufferString);
                bufferItem = res.content.climate;
                bufferString = Buffer.from(bufferItem).toString('utf-8');
                setClimate(bufferString);
                bufferItem = res.content.cuisine;
                bufferString = Buffer.from(bufferItem).toString('utf-8');
                setCuisine(bufferString);
                bufferItem = res.content.culture;
                bufferString = Buffer.from(bufferItem).toString('utf-8');
                setCulture(bufferString);
                bufferItem = res.content.currency;
                bufferString = Buffer.from(bufferItem).toString('utf-8');
                setCurrency(bufferString);
                bufferItem = res.content.language;
                bufferString = Buffer.from(bufferItem).toString('utf-8');
                setLanguage(bufferString);
                bufferItem = res.content.politics;
                bufferString = Buffer.from(bufferItem).toString('utf-8');
                setPolitics(bufferString);
            }
        })
    }, [foundCountry]);
    return (
        <div className={styles.results_box}>
                {onMobile &&
                <div className='d-flex mb-5 justify-content-center'>
                    <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="52px" >
                        <path d="m424-318 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"></path>
                    </svg>
                    <h5 className="bd-highlight" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Here are your results{name}!</h5>
                </div>
                }
                {!onMobile &&
                    <div className='d-flex mb-4 justify-content-center'>
                    <svg className="bd-highlight p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="48px" >
                        <path d="m424-318 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"></path>
                    </svg>
                    <h2 className="bd-highlight display-7" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Here are your results{name}!</h2>
                </div>
                }
                <h5  className="bd-highlight" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>{`${countryCodeToName(foundCountry)}`}</h5>
                <div className='d-flex justify-content-center mb-4' >
                    <img
                        style={{boxShadow: '0px 0px 10px #d6d6d6'}}
                        src={`https://flagcdn.com/${foundCountry.toLowerCase()}.svg`}
                        width="128"
                        alt={`${foundCountry}`}
                        />
                </div>
               <div className='mb-5'>
                <p>{description}</p>
               </div>
               
               <div className='d-flex justify-content-center mb-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e08550" height="52px" >
                        <path d="M440-760v-160h80v160h-80Zm266 110-56-56 113-114 56 57-113 113Zm54 210v-80h160v80H760Zm3 299L650-254l56-56 114 112-57 57ZM254-650 141-763l57-57 112 114-56 56Zm-14 450h180q25 0 42.5-17.5T480-260q0-25-17-42.5T421-320h-51l-20-48q-14-33-44-52.5T240-440q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T40-320q0-83 58.5-141.5T240-520q60 0 109.5 32.5T423-400q58 0 97.5 43T560-254q-2 57-42.5 95.5T420-120H240Zm320-134q-5-20-10-39t-10-39q45-19 72.5-59t27.5-89q0-66-47-113t-113-47q-60 0-105 39t-53 99q-20-5-41-9t-41-9q14-88 82.5-144T480-720q100 0 170 70t70 170q0 77-44 138.5T560-254Zm-79-226Z"></path>
                </svg>
                </div>
                <p className='mb-5'>{climate}</p>

               <div className='d-flex justify-content-center mb-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#a05050" height="52px" >
                        <path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z"></path>
                </svg>
                </div>
                <p className='mb-5'>{cuisine}</p>

                <div className='d-flex justify-content-center mb-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5050a0" height="52px" >
                        <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"></path>
                </svg>
                </div>
                <p className='mb-5'>{culture}</p>
               
                <div className='d-flex justify-content-center mb-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#509050" height="52px" >
                        <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z"></path>
                </svg>
                </div>
                <p className='mb-5'>{currency}</p>
              
                <div className='d-flex justify-content-center mb-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#6090c0" height="52px" >
                        <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"></path>
                </svg>
                </div>
                <p className='mb-5'>{language}</p>
               
                <div className='d-flex justify-content-center mb-1'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#7050a0" height="52px" >
                        <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z"></path>
                </svg>
                </div>
                <p className='mb-5'>{politics}</p>
        </div>
    );
}
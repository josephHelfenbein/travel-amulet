import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
import FormikSelect from './FormikSelect';
import FormikMultiSelect from './FormikMultiSelect';
import validationSchema from './validationSchema';
import { countryOptions } from './signup-form';
import { Tooltip, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { changeUserPreferences } from 'lib/http';
import axios from 'axios';

interface Values{
    languageSpeak: string,
    temperatureSelect: string,
    spicySelect: string,
    lgbtqSelect: string,
    religionSelect: string,
    crimeSelect: string,
    visitSelect: string,
    hikingSelect: string,
    beachesSelect: string,
    broadbandSelect: string,
    mobileSelect: string,
    waterSelect: string,
    conflictSelect: string,
    stabilitySelect: string,
    governmentSelect: string,
    language: string,
    religion: string,
    continentList: string[],
    blacklistCountries: string[],
}
const continentOptions = [
    { value: "NA", label: "North America" },
    { value: "SA", label: "South America" },
    { value: "EU", label: "Europe" },
    { value: "AS", label: "Asia" },
    { value: "AF", label: "Africa" },
    { value: "OC", label: "Oceania" },
];
const defaultOptions = [
    { value: "2", label: "Important" },
    { value: "3", label: "Very Important" },
    { value: "1", label: "No Preference" },
];
const temperatureOptions = [
    { value: "2", label: "Cold" },
    { value: "3", label: "Cool" },
    { value: "4", label: "Warm" },
    { value: "5", label: "Hot" },
    { value: "1", label: "No Preference" },
];
const spicyOptions = [
    { value: "2", label: "Mild" },
    { value: "3", label: "Medium" },
    { value: "4", label: "Hot" },
    { value: "5", label: "Extra Hot" },
    { value: "1", label: "No Preference" },
];
function answerToEncodable(answer:string){
    if(answer == '') return '0';
    else return answer;
}
function encodeAnswers(values:Values){
    let returnStr = '';
    returnStr+=answerToEncodable(values.languageSpeak);
    returnStr+=answerToEncodable(values.temperatureSelect);
    returnStr+=answerToEncodable(values.spicySelect);
    returnStr+=answerToEncodable(values.lgbtqSelect);
    returnStr+=answerToEncodable(values.religionSelect);
    returnStr+=answerToEncodable(values.crimeSelect);
    returnStr+=answerToEncodable(values.visitSelect);
    returnStr+=answerToEncodable(values.hikingSelect);
    returnStr+=answerToEncodable(values.beachesSelect);
    returnStr+=answerToEncodable(values.broadbandSelect);
    returnStr+=answerToEncodable(values.mobileSelect);
    returnStr+=answerToEncodable(values.waterSelect);
    returnStr+=answerToEncodable(values.conflictSelect);
    returnStr+=answerToEncodable(values.stabilitySelect);
    returnStr+=answerToEncodable(values.governmentSelect);
    return returnStr;
}
function answerToDecodable(answer:string){
    if(answer == '0') return '';
    else return answer;
}
function decodeAnswers(preferencesStr:string){
    const languageSpeak = answerToDecodable(preferencesStr[0]);
    const temperatureSelect = answerToDecodable(preferencesStr[1]);
    const spicySelect = answerToDecodable(preferencesStr[2]);
    const lgbtqSelect = answerToDecodable(preferencesStr[3]);
    const religionSelect = answerToDecodable(preferencesStr[4]);
    const crimeSelect = answerToDecodable(preferencesStr[5]);
    const visitSelect = answerToDecodable(preferencesStr[6]);
    const hikingSelect = answerToDecodable(preferencesStr[7]);
    const beachesSelect = answerToDecodable(preferencesStr[8]);
    const broadbandSelect = answerToDecodable(preferencesStr[9]);
    const mobileSelect = answerToDecodable(preferencesStr[10]);
    const waterSelect = answerToDecodable(preferencesStr[11]);
    const conflictSelect = answerToDecodable(preferencesStr[12]);
    const stabilitySelect = answerToDecodable(preferencesStr[13]);
    const governmentSelect = answerToDecodable(preferencesStr[14]);
    const values:Values = {
        languageSpeak,
        temperatureSelect,
        spicySelect,
        lgbtqSelect,
        religionSelect,
        crimeSelect,
        visitSelect,
        hikingSelect,
        beachesSelect,
        broadbandSelect,
        mobileSelect,
        waterSelect,
        conflictSelect,
        stabilitySelect,
        governmentSelect,
        language: '',
        religion: '',
        continentList: [''],
        blacklistCountries: [''],
    }; 
    return values;
}
export default function QuizForm(){
    const [error, setError] = useState('');
    const [saveUpdate, setSaveUpdate] = useState('');
    const {data, status} = useSession({
        required:true,
        onUnauthenticated() {
            setError('You can save your progress if you log in.');
        },
    });
    const [country, setCountry] = useState('');
    const [preferences, setPreferences] = useState('');
    const [email, setEmail] = useState('');

    const [languageSpeak, setLanguageSpeak] = useState('');
    const [temperatureSelect, setTemperatureSelect] = useState('');
    const [spicySelect, setSpicySelect] = useState('');
    const [lgbtqSelect, setLgbtqSelect] = useState('');
    const [religionSelect, setReligionSelect] = useState('');
    const [crimeSelect, setCrimeSelect] = useState('');
    const [visitSelect, setVisitSelect] = useState('');
    const [hikingSelect, setHikingSelect] = useState('');
    const [beachesSelect, setBeachesSelect] = useState('');
    const [broadbandSelect, setBroadbandSelect] = useState('');
    const [mobileSelect, setMobileSelect] = useState('');
    const [waterSelect, setWaterSelect] = useState('');
    const [conflictSelect, setConflictSelect] = useState('');
    const [stabilitySelect, setStabilitySelect] = useState('');
    const [governmentSelect, setGovernmentSelect] = useState('');
    useEffect(() => {
        if(status==='authenticated'){
            axios.get('/api/auth/session').then(async (res) =>{
                if(res){
                    setEmail(res.data.session.user.email);
                    console.log(res.data.session.user.email);
                    const userRes = await axios.get(`/api/user/${res.data.session.user.email}`);
                    const countryStr = userRes.data.country;
                    
                    setCountry(countryStr);
                    const saveStr = userRes.data.preferences;
                    setPreferences(saveStr);
                }
            })
        }
    }, []);
    useEffect(()=>{
        if(preferences !== ''){
            const foundValues:Values = decodeAnswers(preferences);
            setLanguageSpeak(foundValues.languageSpeak);
            setTemperatureSelect(foundValues.temperatureSelect);
            setSpicySelect(foundValues.spicySelect);
            setLgbtqSelect(foundValues.lgbtqSelect);
            setReligionSelect(foundValues.religionSelect);
            setCrimeSelect(foundValues.crimeSelect);
            setVisitSelect(foundValues.visitSelect);
            setHikingSelect(foundValues.hikingSelect);
            setBeachesSelect(foundValues.beachesSelect);
            setBroadbandSelect(foundValues.broadbandSelect);
            setMobileSelect(foundValues.mobileSelect);
            setWaterSelect(foundValues.waterSelect);
            setConflictSelect(foundValues.conflictSelect);
            setStabilitySelect(foundValues.stabilitySelect);
            setGovernmentSelect(foundValues.governmentSelect);
        }
    })
    return (
        <div className={styles.quiz_box + ' card p-5 mb-5 '}>
            <Formik
            enableReinitialize
            initialValues={{
                languageSpeak: `${languageSpeak}`,
                temperatureSelect: `${temperatureSelect}`,
                spicySelect: `${spicySelect}`,
                lgbtqSelect: `${lgbtqSelect}`,
                religionSelect: `${religionSelect}`,
                crimeSelect: `${crimeSelect}`,
                visitSelect: `${visitSelect}`,
                hikingSelect: `${hikingSelect}`,
                beachesSelect: `${beachesSelect}`,
                broadbandSelect: `${broadbandSelect}`,
                mobileSelect: `${mobileSelect}`,
                waterSelect: `${waterSelect}`,
                conflictSelect: `${conflictSelect}`,
                stabilitySelect: `${stabilitySelect}`,
                governmentSelect: `${governmentSelect}`,
                language: '',
                religion: '',
                continentList: [''],
                blacklistCountries: ["BD", "LY", "LB", "AF", "SO", "IR", "YE", "SY", "RU", "MM", "VE", "IQ", "SS", "ML", "CF", "BF", "HT", "BY", "KP", "UA", "SD", "MX", "IL", "PS", `${country}`],
            }}
            validationSchema={validationSchema}
            onSubmit={(values: Values,
                { setSubmitting }: FormikHelpers<Values>
            ) => {
                setTimeout((async () => {
                    
                    setSubmitting(false);
                }), 500);
            }}
            >{ props => (
                <Form>
                    <div className='row g-3 justify-content-between align-items-end'>
                    <h1 className="display-6 col-md-4 mb-3">Quiz</h1>
                    {error != '' &&
                            <p className='Error col-md-6'>{error}</p>
                    }
                    {error == '' &&
                        <div className='col-md-2 mb-2'>
                        <button type="button" onClick={async ()=>{
                            const changed = await changeUserPreferences({email, preferences:encodeAnswers(props.values)});
                            if(changed) setSaveUpdate('Saved!');
                        }} className="btn btn-primary">Save</button>
                        </div>
                    }
                    </div>
                    {saveUpdate != '' &&
                        <p className='Error col-md-4'>{saveUpdate}</p>
                    }
                    <div className='mb-3'>
                        <h5>Language</h5>
                        <p>Is it important for the majority of the country to speak a language you speak?</p>
                        <FormikSelect
                            name="languageSpeak"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <div className="form-floating mt-3">
                        <Field className="form-control" id="language" name="language" placeholder="What languages?" type="text"/>
                        <label htmlFor="language">If important, what languages do you speak?</label>
                        </div>
                    </div>
                    <div className='mb-3'>
                        <h5>Weather</h5>
                        <p>What temperature would you prefer?</p>
                        <FormikSelect
                            name="temperatureSelect"
                            label="Choose an option..."
                            options={temperatureOptions}
                        />
                    </div>
                    <div className='mb-3'>
                        <h5>Food</h5>
                        <p>What is your preference for spiciness?</p>
                        <FormikSelect
                            name="spicySelect"
                            label="Choose an option..."
                            options={spicyOptions}
                        />
                    </div>
                    <div className='mb-3'>
                        <h5>Society</h5>
                        <p>How important to you is LGBTQ+ equality in the country?</p>
                        <FormikSelect
                            name="lgbtqSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the majority of the country matches your religion?</p>
                        <FormikSelect
                            name="religionSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <div className="form-floating mt-3">
                        <Field className="form-control" id="religion" name="religion" placeholder="What religions?" type="text"/>
                        <label htmlFor="religion">If important, what religion do you follow?</label>
                        </div>
                        <p className='mt-3'>Is it important that the country has a low crime rate?</p>
                        <FormikSelect
                            name="crimeSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                    </div>
                    <div className='mb-3'>
                        <h5>Places to Visit</h5>
                        <p>Is it important that the country has many landmarks?</p>
                        <FormikSelect
                            name="visitSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the country has places for hiking?</p>
                        <FormikSelect
                            name="hikingSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the country has beaches?</p>
                        <FormikSelect
                            name="beachesSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                    </div>
                    <div className='mb-3'>
                        <h5>Technology</h5>
                        <p>Is it important that the country has fast broadband internet speeds?</p>
                        <FormikSelect
                            name="broadbandSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the country has fast mobile internet speeds?</p>
                        <FormikSelect
                            name="mobileSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the country has clean tap water?</p>
                        <FormikSelect
                            name="waterSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                    </div>
                    <div className='mb-3'>
                        <h5>Politics</h5>
                        <p>Is it important that the country has no ongoing conflicts?</p>
                        <FormikSelect
                            name="conflictSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the country has political stability?</p>
                        <FormikSelect
                            name="stabilitySelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <p className='mt-3'>Is it important that the country has a democracy/republic/parliament?</p>
                        <FormikSelect
                            name="governmentSelect"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                    </div>
                    <div className='mb-3'>
                        <h5>Extra</h5>
                        <p>Are there any continents you want to avoid specifically?</p>
                        <FormikMultiSelect
                            name="continentList"
                            label="Select continents..."
                            options={continentOptions}
                        />
                        <p className='mt-3'>Are there any countries you want to avoid specifically?</p>
                        <FormikMultiSelect
                            name="blacklistCountries"
                            label="Select countries..."
                            options={countryOptions}
                        />
                        <Tooltip title="Countries with a US DoS travel advisory of either Level 4 or Level 4 on parts of the country are automatically disabled, but can be enabled if you wish. If signed in, the user's country is also automatically disabled." placement="right">
                            <IconButton>
                                <svg 
                                viewBox="0 0 16 16"
                                width="24"
                                height="24"
                                fill="gray"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16">
                                    </path>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0">
                                    </path>
                                </svg>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className='row g-3 mt-3'>
                        <div className='col-md-8'>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </Form> )}
            </Formik>
        </div>
    );
}
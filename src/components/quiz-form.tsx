import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
import FormikSelect from './FormikSelect';
import FormikMultiSelect from './FormikMultiSelect';
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
    { value: "North America", label: "North America" },
    { value: "South America", label: "South America" },
    { value: "Europe", label: "Europe" },
    { value: "Asia", label: "Asia" },
    { value: "Africa", label: "Africa" },
    { value: "Oceania", label: "Oceania" },
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
const countriesMap = new Map();
for(let i=0; i<countryOptions.length; i++){
    const newName = countryOptions[i].label.substring(0, countryOptions[i].label.length-5);
    countriesMap.set(countryOptions[i].value, newName);
}
function countryCodeToName(code:string){
    return countriesMap.get(code);
}
function createPrompt(values:Values){
    let prompt = "Find a country ";
    if(values.languageSpeak === "2") prompt += "with people that speak " + values.language + ", ";
    else if(values.languageSpeak === "3") prompt += "that mostly speaks " + values.language + ", ";
    if(values.temperatureSelect === "2") prompt += "with cold weather, ";
    else if(values.temperatureSelect === "3") prompt += "with cool weather, ";
    else if(values.temperatureSelect === "4") prompt += "with warm weather, ";
    else if(values.temperatureSelect === "5") prompt += "with hot weather, ";
    if(values.spicySelect === "2") prompt += "with mild food, ";
    else if(values.spicySelect === "3") prompt += "with medium spicy food, ";
    else if(values.spicySelect === "4") prompt += "with hot spicy food, ";
    else if(values.spicySelect === "5") prompt += "with extra hot spicy food, ";
    if(values.lgbtqSelect === "2") prompt += "with an LGBTQ+ equality index of over 60, ";
    else if(values.lgbtqSelect === "3") prompt += "with an LGBTQ+ equality index of over 75, ";
    if(values.religionSelect === "2") prompt += "with people that follow " + values.religion + ", ";
    else if(values.religionSelect === "3") prompt += "with people that mostly follow " + values.religion + ", ";
    if(values.crimeSelect === "2") prompt += "with a crime index of under 6, ";
    else if(values.crimeSelect === "3") prompt += "with a crime index of under 4.5, ";
    if(values.visitSelect === "2") prompt += "with landmarks, ";
    else if(values.visitSelect === "3") prompt += "with many landmarks, ";
    if(values.hikingSelect === "2") prompt += "with places for hiking, ";
    else if(values.hikingSelect === "3") prompt += "with many places for hiking, ";
    if(values.beachesSelect === "2") prompt += "with beaches, ";
    else if(values.beachesSelect === "3") prompt += "with many beaches, ";
    if(values.broadbandSelect === "2") prompt += "with broadband download speed of over 50 Mbps, ";
    else if(values.broadbandSelect === "3") prompt += "with broadband download speed of over 100 Mbps, ";
    if(values.mobileSelect === "2") prompt += "with mobile download speed of over 40 Mbps, ";
    else if(values.mobileSelect === "3") prompt += "with mobile download speed of over 80 Mbps, ";
    if(values.waterSelect === "2") prompt += "with a tap water index of over 60, ";
    else if(values.waterSelect === "3") prompt += "with a tap water index of over 80, ";
    if(values.conflictSelect === "2") prompt += "with no ongoing conflicts, ";
    else if(values.conflictSelect === "3") prompt += "with no ongoing conflicts or regional tensions, ";
    if(values.stabilitySelect === "2") prompt += "with political stability, ";
    else if(values.stabilitySelect === "3") prompt += "with political stability and no political tensions, ";
    if(values.governmentSelect === "2") prompt += "with a government that has a voting system, ";
    else if(values.governmentSelect === "3") prompt += "with a democracy, ";
    if(values.continentList.length > 1) {
        prompt += "not in the continents of ";
        for(let i=1; i<values.continentList.length; i++){
            if (values.continentList.length == 2) prompt += values.continentList[i]+", ";
            else if(i==values.continentList.length-1) prompt += "or "+values.continentList[i] + ", ";
            else prompt+=values.continentList[i]+", ";
        }
    }
    if(values.blacklistCountries.length > 0){
        if(values.blacklistCountries[0] !== '' || values.blacklistCountries.length > 1){
            prompt += "and specifically not ";
            for(let i=0; i<values.blacklistCountries.length; i++){
                if(values.blacklistCountries[i] === '') {}
                else if(values.blacklistCountries.length == 2 && (values.blacklistCountries[0] === '' || values.blacklistCountries[1] === '')) prompt += countryCodeToName(values.blacklistCountries[i])+".";
                else if (values.blacklistCountries.length == 1 && values.blacklistCountries[0] !== '') prompt += countryCodeToName(values.blacklistCountries[i])+".";
                else if(i==values.blacklistCountries.length-1 && values.blacklistCountries[values.blacklistCountries.length-1] !== '') prompt += "or "+countryCodeToName(values.blacklistCountries[i]) + ".";
                else if(i==values.blacklistCountries.length-2 && values.blacklistCountries[values.blacklistCountries.length-1] === '') prompt += "or "+countryCodeToName(values.blacklistCountries[i]) + ".";
                else prompt+=countryCodeToName(values.blacklistCountries[i])+", ";
            }
        }
    }
    return prompt;
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

    const [quizIndex, setQuizIndex] = useState(0);
    const [onMobile, setOnMobile] = useState(false);
    useEffect(()=> {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
            setOnMobile(true);
    })
    useEffect(() => {
        axios.get('/api/auth/session').then(async (res) =>{
            if(res){
                setEmail(res.data.session.user.email);
                const userRes = await axios.get(`/api/user/${res.data.session.user.email}`);
                const countryStr = userRes.data.country;
       
                setCountry(countryStr);
                const saveStr = userRes.data.preferences;
                setPreferences(saveStr);
            }
        }).catch(error => {
            console.log('Not logged in');
        })
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
        <div className={styles.quiz_box + ' p-5 pt-0 mb-5 '}>
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
            onSubmit={(values: Values,
                { setSubmitting }: FormikHelpers<Values>
            ) => {
                setTimeout((async () => {
                    if(error == '') changeUserPreferences({email, preferences:encodeAnswers(values)});
                    const prompt = createPrompt(values);
                    alert(prompt);
                    setSubmitting(false);
                }), 500);
            }}
            >{ props => (
                <Form>
                    <div className='row g-2 justify-content-between align-items-end mb-4'>
                    {onMobile && 
                        <h1 className="display-6 col">Quiz</h1>
                    }
                    {!onMobile && 
                        <h1 className="display-6 col-md-4">Quiz</h1>
                    }
                    {error != '' &&
                            <p className='Error col-md-6'>{error}</p>
                    }
                    {error == '' &&
                        <div className='col-3 '>
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
                    {quizIndex==0 &&
                        <div className='mb-3'>
                        <h5>Language</h5>
                        <p>Is it important for the majority of the country to speak a language you speak?</p>
                        <FormikSelect
                            name="languageSpeak"
                            label="Choose an option..."
                            options={defaultOptions}
                        />
                        <div className="form-floating mt-3">
                        <Field className='form-control' id="language" name="language" placeholder="What languages?" type="text"/>
                        <label className={styles.extraInputForm} htmlFor="language">What languages do you speak?</label>
                        </div>
                    </div>
                    }
                    {quizIndex==1 &&
                        <div className='mb-3'>
                            <h5>Weather</h5>
                            <p>What temperature would you prefer?</p>
                            <FormikSelect
                                name="temperatureSelect"
                                label="Choose an option..."
                                options={temperatureOptions}
                            />
                        </div>
                    }
                    {quizIndex==2 &&
                        <div className='mb-3'>
                            <h5>Food</h5>
                            <p>What is your preference for spiciness?</p>
                            <FormikSelect
                                name="spicySelect"
                                label="Choose an option..."
                                options={spicyOptions}
                            />
                        </div>
                    }
                    {quizIndex==3 &&
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
                            <Field className='form-control' id="religion" name="religion" placeholder="What religions?" type="text"/>
                            <label className={styles.extraInputForm} htmlFor="religion">What religion do you follow?</label>
                            </div>
                            <p className='mt-3'>Is it important that the country has a low crime rate?</p>
                            <FormikSelect
                                name="crimeSelect"
                                label="Choose an option..."
                                options={defaultOptions}
                            />
                        </div>
                    }
                    {quizIndex==4 &&
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
                    }
                    {quizIndex==5 &&
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
                    }
                    {quizIndex==6 &&
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
                            <p className='mt-3'>Is it important that the country has a democracy?</p>
                            <FormikSelect
                                name="governmentSelect"
                                label="Choose an option..."
                                options={defaultOptions}
                            />
                        </div>
                    }
                    {quizIndex==7 &&
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
                            <Tooltip title="Countries with a US DoS travel advisory of either Level 4 or Level 4 on parts of the country are automatically disabled, but can be enabled if you wish. If signed in, the user's country is also automatically disabled." placement="bottom">
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
                    }
                    {!onMobile &&
                        <div className='row g-3 mt-3 justify-content-end position-fixed bottom-0 mb-4' style={{width:'80%'}}>
                            {quizIndex>0 &&
                                    <div className='col-1'>
                                        <button type="button" className="btn btn-dark" onClick={()=>{
                                            setQuizIndex(quizIndex-1);
                                        }}>Back</button>
                                    </div>
                            }
                            {quizIndex<7 &&
                                    <div className='col-2'>
                                        <button type="button" className="btn btn-success" onClick={()=>{
                                            setQuizIndex(quizIndex+1);
                                        }}>Next</button>
                                    </div>
                            }
                            {quizIndex==7 &&
                                    <div className='col-2'>
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                            }
                        </div>
                    }
                    {onMobile && 
                        <div className='row g-3 mt-3 justify-content-end position-fixed bottom-0 mb-4' style={{width:'80%'}}>
                            {quizIndex>0 &&
                                    <div className='col-3'>
                                        <button type="button" className="btn btn-dark" onClick={()=>{
                                            setQuizIndex(quizIndex-1);
                                        }}>Back</button>
                                    </div>
                            }
                            {quizIndex<7 &&
                                    <div className='col-3'>
                                        <button type="button" className="btn btn-success" onClick={()=>{
                                            setQuizIndex(quizIndex+1);
                                        }}>Next</button>
                                    </div>
                            }
                            {quizIndex==7 &&
                                    <div className='col-3'>
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                            }
                        </div>
                    }
                    
                </Form> )}
            </Formik>
        </div>
    );
}
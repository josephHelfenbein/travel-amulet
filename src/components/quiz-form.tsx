import { Formik, Field, Form, FormikHelpers } from 'formik';
import styles from './login-form.module.css';
import FormikSelect from './FormikSelect';
import FormikMultiSelect from './FormikMultiSelect';
import { countryOptions } from './countryoptions';
import { Tooltip, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { changeUserPreferences } from 'lib/http';
import axios from 'axios';

interface Values {
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
function answerToEncodable(answer: string) {
    if (answer == '') return '0';
    else return answer;
}
function encodeAnswers(values: Values) {
    let returnStr = '';
    returnStr += answerToEncodable(values.languageSpeak);
    returnStr += answerToEncodable(values.temperatureSelect);
    returnStr += answerToEncodable(values.spicySelect);
    returnStr += answerToEncodable(values.lgbtqSelect);
    returnStr += answerToEncodable(values.religionSelect);
    returnStr += answerToEncodable(values.crimeSelect);
    returnStr += answerToEncodable(values.visitSelect);
    returnStr += answerToEncodable(values.hikingSelect);
    returnStr += answerToEncodable(values.beachesSelect);
    returnStr += answerToEncodable(values.broadbandSelect);
    returnStr += answerToEncodable(values.mobileSelect);
    returnStr += answerToEncodable(values.waterSelect);
    returnStr += answerToEncodable(values.conflictSelect);
    returnStr += answerToEncodable(values.stabilitySelect);
    returnStr += answerToEncodable(values.governmentSelect);
    return returnStr;
}
function answerToDecodable(answer: string) {
    if (answer == '0') return '';
    else return answer;
}
function decodeAnswers(preferencesStr: string) {
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
    const values: Values = {
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
for (let i = 0; i < countryOptions.length; i++) {
    const newName = countryOptions[i].label.substring(0, countryOptions[i].label.length - 5);
    countriesMap.set(countryOptions[i].value, newName);
}
function countryCodeToName(code: string) {
    return countriesMap.get(code);
}
function createPrompt(values: Values) {
    let prompt = "Find a country ";
    if (values.languageSpeak === "2") prompt += "with people that speak " + values.language + ", ";
    else if (values.languageSpeak === "3") prompt += "that mostly speaks " + values.language + ", ";
    if (values.temperatureSelect === "2") prompt += "with cold weather, ";
    else if (values.temperatureSelect === "3") prompt += "with cool weather, ";
    else if (values.temperatureSelect === "4") prompt += "with warm weather, ";
    else if (values.temperatureSelect === "5") prompt += "with hot weather, ";
    if (values.spicySelect === "2") prompt += "with mild food, ";
    else if (values.spicySelect === "3") prompt += "with medium spicy food, ";
    else if (values.spicySelect === "4") prompt += "with hot spicy food, ";
    else if (values.spicySelect === "5") prompt += "with extra hot spicy food, ";
    if (values.lgbtqSelect === "2") prompt += "with an LGBTQ+ equality index of over 60, ";
    else if (values.lgbtqSelect === "3") prompt += "with an LGBTQ+ equality index of over 75, ";
    if (values.religionSelect === "2") prompt += "with people that follow " + values.religion + ", ";
    else if (values.religionSelect === "3") prompt += "with people that mostly follow " + values.religion + ", ";
    if (values.crimeSelect === "2") prompt += "with a crime index of under 6, ";
    else if (values.crimeSelect === "3") prompt += "with a crime index of under 4.5, ";
    if (values.visitSelect === "2") prompt += "with landmarks, ";
    else if (values.visitSelect === "3") prompt += "with many landmarks, ";
    if (values.hikingSelect === "2") prompt += "with places for hiking, ";
    else if (values.hikingSelect === "3") prompt += "with many places for hiking, ";
    if (values.beachesSelect === "2") prompt += "with beaches, ";
    else if (values.beachesSelect === "3") prompt += "with many beaches, ";
    if (values.broadbandSelect === "2") prompt += "with broadband download speed of over 50 Mbps, ";
    else if (values.broadbandSelect === "3") prompt += "with broadband download speed of over 100 Mbps, ";
    if (values.mobileSelect === "2") prompt += "with mobile download speed of over 40 Mbps, ";
    else if (values.mobileSelect === "3") prompt += "with mobile download speed of over 80 Mbps, ";
    if (values.waterSelect === "2") prompt += "with a tap water index of over 60, ";
    else if (values.waterSelect === "3") prompt += "with a tap water index of over 80, ";
    if (values.conflictSelect === "2") prompt += "with no ongoing conflicts, ";
    else if (values.conflictSelect === "3") prompt += "with no ongoing conflicts or regional tensions, ";
    if (values.stabilitySelect === "2") prompt += "with political stability, ";
    else if (values.stabilitySelect === "3") prompt += "with political stability and no political tensions, ";
    if (values.governmentSelect === "2") prompt += "with a government that has a voting system, ";
    else if (values.governmentSelect === "3") prompt += "with a democracy, ";
    if (values.continentList.length > 1) {
        prompt += "not in the continents of ";
        for (let i = 1; i < values.continentList.length; i++) {
            if (values.continentList.length == 2) prompt += values.continentList[i] + ", ";
            else if (i == values.continentList.length - 1) prompt += "or " + values.continentList[i] + ", ";
            else prompt += values.continentList[i] + ", ";
        }
    }
    if (values.blacklistCountries.length > 0) {
        if (values.blacklistCountries[0] !== '' || values.blacklistCountries.length > 1) {
            prompt += "and specifically not ";
            for (let i = 0; i < values.blacklistCountries.length; i++) {
                if (values.blacklistCountries[i] === '') { }
                else if (values.blacklistCountries.length == 2 && (values.blacklistCountries[0] === '' || values.blacklistCountries[1] === '')) prompt += countryCodeToName(values.blacklistCountries[i]) + ".";
                else if (values.blacklistCountries.length == 1 && values.blacklistCountries[0] !== '') prompt += countryCodeToName(values.blacklistCountries[i]) + ".";
                else if (i == values.blacklistCountries.length - 1 && values.blacklistCountries[values.blacklistCountries.length - 1] !== '') prompt += "or " + countryCodeToName(values.blacklistCountries[i]) + ".";
                else if (i == values.blacklistCountries.length - 2 && values.blacklistCountries[values.blacklistCountries.length - 1] === '') prompt += "or " + countryCodeToName(values.blacklistCountries[i]) + ".";
                else prompt += countryCodeToName(values.blacklistCountries[i]) + ", ";
            }
        }
    }
    return prompt;
}
export default function QuizForm() {
    const [error, setError] = useState('');
    const [saveUpdate, setSaveUpdate] = useState('');
    const { data, status } = useSession({
        required: true,
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
    useEffect(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
            setOnMobile(true);
    })
    useEffect(() => {
        axios.get('/api/auth/session').then(async (res) => {
            if (res) {
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
    useEffect(() => {
        if (preferences !== '') {
            const foundValues: Values = decodeAnswers(preferences);
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
        <div className={styles.quiz_box + ' pb-4 '}>
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
                        if (error == '') changeUserPreferences({ email, preferences: encodeAnswers(values) });
                        const prompt = createPrompt(values);

                        // alert(prompt);
                        
                        axios.get('../api/vector_search.py', { params: { prompt } }).then((res) => {
                            console.log(res.data);
                        })

                        setSubmitting(false);
                    }), 500);
                }}
            >{props => (
                <Form>
                    <div className='row g-2 justify-content-between mb-4 mt-2'>
                        {onMobile &&
                            <svg className="col-1 p-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="38px" >
                                <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"></path>
                            </svg>
                        }
                        {!onMobile &&
                            <svg className="col-1 p-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#505050" height="48px" >
                                <path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"></path>
                            </svg>
                        }
                        {onMobile &&
                            <h1 className="display-6 col-4" style={{ fontWeight: 400, color: '#505050' }}>Quiz</h1>
                        }
                        {!onMobile &&
                            <h1 className="display-6 col-4" style={{ fontWeight: 400, color: '#505050' }}>Quiz</h1>
                        }
                        {error != '' &&
                            <p className='Error col-7' style={{ fontWeight: 300, color: '#505050' }}>{error}</p>
                        }
                        {error == '' && !onMobile &&
                            <div className='col-3'>
                                <button type="button" onClick={async () => {
                                    const changed = await changeUserPreferences({ email, preferences: encodeAnswers(props.values) });
                                    if (changed) setSaveUpdate('Saved!');
                                }} id={styles.save} className={styles.buttonQuiz + " btn btn-secondary"}>Save</button>
                            </div>
                        }
                        {error == '' && onMobile &&
                            <div className='col-4'>
                                <button type="button" onClick={async () => {
                                    const changed = await changeUserPreferences({ email, preferences: encodeAnswers(props.values) });
                                    if (changed) setSaveUpdate('Saved!');
                                }} id={styles.save} className={styles.buttonQuiz + " btn btn-secondary"}>Save</button>
                            </div>
                        }
                    </div>
                    {saveUpdate != '' &&
                        <p className='Error col-md-4'>{saveUpdate}</p>
                    }
                    {quizIndex == 0 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#6090c0" height="52px" >
                                    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"></path>
                                </svg>
                                <h5>Language</h5>
                                <p>Is it important for the majority of the country to speak a language you speak?</p>
                            </div>
                            <FormikSelect
                                name="languageSpeak"
                                label="Choose an option..."
                                options={defaultOptions}
                            />
                            <div className="form-floating mt-3">
                                <Field className={styles.inputForm + " form-control"} id="language" name="language" placeholder="What languages?" type="text" />
                                <label className={styles.extraInputForm} htmlFor="language">What languages do you speak?</label>
                            </div>
                        </div>
                    }
                    {quizIndex == 1 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e08550" height="52px" >
                                    <path d="M440-760v-160h80v160h-80Zm266 110-56-56 113-114 56 57-113 113Zm54 210v-80h160v80H760Zm3 299L650-254l56-56 114 112-57 57ZM254-650 141-763l57-57 112 114-56 56Zm-14 450h180q25 0 42.5-17.5T480-260q0-25-17-42.5T421-320h-51l-20-48q-14-33-44-52.5T240-440q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T40-320q0-83 58.5-141.5T240-520q60 0 109.5 32.5T423-400q58 0 97.5 43T560-254q-2 57-42.5 95.5T420-120H240Zm320-134q-5-20-10-39t-10-39q45-19 72.5-59t27.5-89q0-66-47-113t-113-47q-60 0-105 39t-53 99q-20-5-41-9t-41-9q14-88 82.5-144T480-720q100 0 170 70t70 170q0 77-44 138.5T560-254Zm-79-226Z"></path>
                                </svg>
                                <h5>Weather</h5>
                                <p>What temperature would you prefer?</p>
                            </div>
                            <FormikSelect
                                name="temperatureSelect"
                                label="Choose an option..."
                                options={temperatureOptions}
                            />
                        </div>
                    }
                    {quizIndex == 2 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#a05050" height="52px" >
                                    <path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z"></path>
                                </svg>
                                <h5>Food</h5>
                                <p>What is your preference for spiciness?</p>
                            </div>
                            <FormikSelect
                                name="spicySelect"
                                label="Choose an option..."
                                options={spicyOptions}
                            />
                        </div>
                    }
                    {quizIndex == 3 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5050a0" height="52px" >
                                    <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"></path>
                                </svg>
                                <h5>Society</h5>
                                <p>How important to you is LGBTQ+ equality in the country?</p>
                            </div>
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
                                <Field className={styles.inputForm + " form-control"} id="religion" name="religion" placeholder="What religions?" type="text" />
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
                    {quizIndex == 4 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#508060" height="52px" >
                                    <path d="M80-120v-80h160v-160h-80v-80h84q12-75 66.5-129.5T440-636v-204h280v160H520v44q75 12 129.5 66.5T716-440h84v80h-80v160h160v80H80Zm240-80h120v-160H320v160Zm200 0h120v-160H520v160ZM326-440h308q-14-53-57-86.5T480-560q-54 0-97 33.5T326-440Zm154 0Z"></path>
                                </svg>
                                <h5>Places to Visit</h5>
                                <p>Is it important that the country has many landmarks?</p>
                            </div>
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
                    {quizIndex == 5 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#c09050" height="52px" >
                                    <path d="M196-276q-57-60-86.5-133T80-560q0-78 29.5-151T196-844l48 48q-48 48-72 110.5T148-560q0 63 24 125.5T244-324l-48 48Zm96-96q-39-39-59.5-88T212-560q0-51 20.5-100t59.5-88l48 48q-30 27-45 64t-15 76q0 36 15 73t45 67l-48 48ZM280-80l135-405q-16-14-25.5-33t-9.5-42q0-42 29-71t71-29q42 0 71 29t29 71q0 23-9.5 42T545-485L680-80h-80l-26-80H387l-27 80h-80Zm133-160h134l-67-200-67 200Zm255-132-48-48q30-27 45-64t15-76q0-36-15-73t-45-67l48-48q39 39 58 88t22 100q0 51-20.5 100T668-372Zm96 96-48-48q48-48 72-110.5T812-560q0-63-24-125.5T716-796l48-48q57 60 86.5 133T880-560q0 78-28 151t-88 133Z"></path>
                                </svg>
                                <h5>Technology</h5>
                                <p>Is it important that the country has fast broadband internet speeds?</p>
                            </div>
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
                    {quizIndex == 6 &&
                        <div className='mb-3'>
                            <div className='content'>
                                <svg className="img-fluid float-md-end me-md-3 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#7050a0" height="52px" >
                                    <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z"></path>
                                </svg>
                                <h5>Politics</h5>
                                <p>Is it important that the country has no ongoing conflicts?</p>
                            </div>
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
                    {quizIndex == 7 &&
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
                        <div className='row g-0 justify-content-end mt-4 position-fixed bottom-0 mb-4' style={{ width: '700px' }}>
                            {quizIndex > 0 &&
                                <div className='col-3'>
                                    <button type="button" id={styles.secondary} className={styles.buttonQuiz + " btn btn-secondary"} onClick={() => {
                                        setQuizIndex(quizIndex - 1);
                                    }}>Back</button>
                                </div>
                            }
                            {quizIndex < 7 &&
                                <div className='col-3'>
                                    <button type="button" id={styles.primary} className={styles.buttonQuiz + " btn btn-secondary"} onClick={() => {
                                        setQuizIndex(quizIndex + 1);
                                    }}>Next</button>
                                </div>
                            }
                            {quizIndex == 7 &&
                                <div className='col-3'>
                                    <button type="submit" id={styles.primary} className={styles.buttonQuiz + " btn btn-secondary"}>Submit</button>
                                </div>
                            }
                        </div>
                    }
                    {onMobile &&
                        <div className='row g-0 justify-content-end mt-4 position-fixed bottom-0 mb-4' style={{ width: '70%' }}>
                            {quizIndex > 0 &&
                                <div className='col-6'>
                                    <button type="button" id={styles.secondary} className={styles.buttonQuiz + " btn btn-secondary"} onClick={() => {
                                        setQuizIndex(quizIndex - 1);
                                    }}>Back</button>
                                </div>
                            }
                            {quizIndex < 7 &&
                                <div className='col-3'>
                                    <button type="button" id={styles.primary} className={styles.buttonQuiz + " btn btn-secondary"} onClick={() => {
                                        setQuizIndex(quizIndex + 1);
                                    }}>Next</button>
                                </div>
                            }
                            {quizIndex == 7 &&
                                <div className='col-3'>
                                    <button type="submit" id={styles.primary} className={styles.buttonQuiz + " btn btn-secondary"}>Submit</button>
                                </div>
                            }
                        </div>
                    }

                </Form>)}
            </Formik>
        </div>
    );
}
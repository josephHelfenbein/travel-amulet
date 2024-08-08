import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import styles from './login-form.module.css';
import FormikSelect from './FormikSelect';
import FormikMultiSelect from './FormikMultiSelect';
import validationSchema from './validationSchema';
import { countryOptions } from './signup-form';
import { Tooltip, IconButton } from '@mui/material';


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
    { value: "1", label: "Important" },
    { value: "2", label: "Very Important" },
    { value: "0", label: "No Preference" },
];
const temperatureOptions = [
    { value: "1", label: "Cold" },
    { value: "2", label: "Cool" },
    { value: "3", label: "Warm" },
    { value: "4", label: "Hot" },
    { value: "0", label: "No Preference" },
];
const spicyOptions = [
    { value: "1", label: "Mild" },
    { value: "2", label: "Medium" },
    { value: "3", label: "Hot" },
    { value: "4", label: "Extra Hot" },
    { value: "0", label: "No Preference" },
];
export default function QuizForm(){
    return (
        <div className={styles.quiz_box + ' card p-5 mb-5 '}>
            <h1 className="display-6 mb-3">Quiz</h1>
            <Formik
            initialValues={{
                languageSpeak: '',
                temperatureSelect: '',
                spicySelect: '',
                lgbtqSelect: '',
                religionSelect: '',
                crimeSelect: '',
                visitSelect: '',
                hikingSelect: '',
                beachesSelect: '',
                broadbandSelect: '',
                mobileSelect: '',
                waterSelect: '',
                conflictSelect: '',
                stabilitySelect: '',
                governmentSelect: '',
                language: '',
                religion: '',
                continentList: [''],
                blacklistCountries: ["BD", "LY", "LB", "AF", "SO", "IR", "YE", "SY", "RU", "MM", "VE", "IQ", "SS", "ML", "CF", "BF", "HT", "BY", "KP", "UA", "SD", "MX", "IL", "PS"],
            }}
            validationSchema={validationSchema}
            onSubmit={(values: Values,
                { setSubmitting }: FormikHelpers<Values>
            ) => {
                setTimeout((async () => {
                    
                    setSubmitting(false);
                }), 500);
            }}
            >
                <Form>
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
                        <Tooltip title="Countries with a US DoS travel advisory of either Level 4 or Level 4 on parts of the country are automatically disabled, but can be enabled if you wish." placement="right">
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
                </Form>
            </Formik>
        </div>
    );
}
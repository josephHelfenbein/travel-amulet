import styles from './login-form.module.css';
import { Formik, Field, Form, FormikHelpers } from 'formik'; 
import FormikSelect from "./FormikSelect";
import validationSchema from "./validationSchema";
import {useState} from 'react';

import { fetchUserExistsEmail, postUser } from 'lib/http';
import { useRouter } from 'next/router';

interface Values{
    username: string;
    password: string;
    name: string;
    singleSelect: string;
}
const countryOptions = [
    { value: "AD", label: "Andorra 🇦🇩" },
    { value: "AE", label: "United Arab Emirates 🇦🇪" },
    { value: "AF", label: "Afghanistan 🇦🇫" },
    { value: "AG", label: "Antigua and Barbuda 🇦🇬" },
    { value: "AL", label: "Albania 🇦🇱" },
    { value: "AM", label: "Armenia 🇦🇲" },
    { value: "AO", label: "Angola 🇦🇴" },
    { value: "AR", label: "Argentina 🇦🇷" },
    { value: "AT", label: "Austria 🇦🇹" },
    { value: "AU", label: "Australia 🇦🇺" },
    { value: "AZ", label: "Azerbaijan 🇦🇿" },
    { value: "BA", label: "Bosnia and Herzegovina 🇧🇦" },
    { value: "BB", label: "Barbados 🇧🇧" },
    { value: "BD", label: "Bangladesh 🇧🇩" },
    { value: "BE", label: "Belgium 🇧🇪" },
    { value: "BF", label: "Burkina Faso 🇧🇫" },
    { value: "BG", label: "Bulgaria 🇧🇬" },
    { value: "BH", label: "Bahrain 🇧🇭" },
    { value: "BI", label: "Burundi 🇧🇮" },
    { value: "BJ", label: "Benin 🇧🇯" },
    { value: "BN", label: "Brunei 🇧🇳" },
    { value: "BO", label: "Bolivia 🇧🇴" },
    { value: "BR", label: "Brazil 🇧🇷" },
    { value: "BS", label: "Bahamas 🇧🇸" },
    { value: "BT", label: "Bhutan 🇧🇹" },
    { value: "BW", label: "Botswana 🇧🇼" },
    { value: "BY", label: "Belarus 🇧🇾" },
    { value: "BZ", label: "Belize 🇧🇿" },
    { value: "CA", label: "Canada 🇨🇦" },
    { value: "CD", label: "Democratic Republic of the Congo 🇨🇩" },
    { value: "CF", label: "Central African Republic 🇨🇫" },
    { value: "CG", label: "Republic of the Congo 🇨🇬" },
    { value: "CH", label: "Switzerland 🇨🇭" },
    { value: "CI", label: "Côte d'Ivoire 🇨🇮" },
    { value: "CL", label: "Chile 🇨🇱" },
    { value: "CM", label: "Cameroon 🇨🇲" },
    { value: "CN", label: "China 🇨🇳" },
    { value: "CO", label: "Colombia 🇨🇴" },
    { value: "CR", label: "Costa Rica 🇨🇷" },
    { value: "CU", label: "Cuba 🇨🇺" },
    { value: "CV", label: "Cabo Verde 🇨🇻" },
    { value: "CY", label: "Cyprus 🇨🇾" },
    { value: "CZ", label: "Czechia 🇨🇿" },
    { value: "DE", label: "Germany 🇩🇪" },
    { value: "DJ", label: "Djibouti 🇩🇯" },
    { value: "DK", label: "Denmark 🇩🇰" },
    { value: "DM", label: "Dominica 🇩🇲" },
    { value: "DO", label: "Dominican Republic 🇩🇴" },
    { value: "DZ", label: "Algeria 🇩🇿" },
    { value: "EC", label: "Ecuador 🇪🇨" },
    { value: "EE", label: "Estonia 🇪🇪" },
    { value: "EG", label: "Egypt 🇪🇬" },
    { value: "ER", label: "Eritrea 🇪🇷" },
    { value: "ES", label: "Spain 🇪🇸" },
    { value: "ET", label: "Ethiopia 🇪🇹" },
    { value: "FI", label: "Finland 🇫🇮" },
    { value: "FJ", label: "Fiji 🇫🇯" },
    { value: "FM", label: "Micronesia 🇫🇲" },
    { value: "FR", label: "France 🇫🇷" },
    { value: "GA", label: "Gabon 🇬🇦" },
    { value: "GB", label: "United Kingdom 🇬🇧" },
    { value: "GD", label: "Grenada 🇬🇩" },
    { value: "GE", label: "Georgia 🇬🇪" },
    { value: "GH", label: "Ghana 🇬🇭" },
    { value: "GM", label: "Gambia 🇬🇲" },
    { value: "GN", label: "Guinea 🇬🇳" },
    { value: "GQ", label: "Equatorial Guinea 🇬🇶" },
    { value: "GR", label: "Greece 🇬🇷" },
    { value: "GT", label: "Guatemala 🇬🇹" },
    { value: "GW", label: "Guinea-Bissau 🇬🇼" },
    { value: "GY", label: "Guyana 🇬🇾" },
    { value: "HN", label: "Honduras 🇭🇳" },
    { value: "HR", label: "Croatia 🇭🇷" },
    { value: "HT", label: "Haiti 🇭🇹" },
    { value: "HU", label: "Hungary 🇭🇺" },
    { value: "ID", label: "Indonesia 🇮🇩" },
    { value: "IE", label: "Ireland 🇮🇪" },
    { value: "IL", label: "Israel 🇮🇱" },
    { value: "IN", label: "India 🇮🇳" },
    { value: "IQ", label: "Iraq 🇮🇶" },
    { value: "IR", label: "Iran 🇮🇷" },
    { value: "IS", label: "Iceland 🇮🇸" },
    { value: "IT", label: "Italy 🇮🇹" },
    { value: "JM", label: "Jamaica 🇯🇲" },
    { value: "JO", label: "Jordan 🇯🇴" },
    { value: "JP", label: "Japan 🇯🇵" },
    { value: "KE", label: "Kenya 🇰🇪" },
    { value: "KG", label: "Kyrgyzstan 🇰🇬" },
    { value: "KH", label: "Cambodia 🇰🇭" },
    { value: "KI", label: "Kiribati 🇰🇮" },
    { value: "KM", label: "Comoros 🇰🇲" },
    { value: "KN", label: "Saint Kitts and Nevis 🇰🇳" },
    { value: "KP", label: "North Korea 🇰🇵" },
    { value: "KR", label: "South Korea 🇰🇷" },
    { value: "KW", label: "Kuwait 🇰🇼" },
    { value: "KZ", label: "Kazakhstan 🇰🇿" },
    { value: "LA", label: "Laos 🇱🇦" },
    { value: "LB", label: "Lebanon 🇱🇧" },
    { value: "LC", label: "Saint Lucia 🇱🇨" },
    { value: "LI", label: "Liechtenstein 🇱🇮" },
    { value: "LK", label: "Sri Lanka 🇱🇰" },
    { value: "LR", label: "Liberia 🇱🇷" },
    { value: "LS", label: "Lesotho 🇱🇸" },
    { value: "LT", label: "Lithuania 🇱🇹" },
    { value: "LU", label: "Luxembourg 🇱🇺" },
    { value: "LV", label: "Latvia 🇱🇻" },
    { value: "LY", label: "Libya 🇱🇾" },
    { value: "MA", label: "Morocco 🇲🇦" },
    { value: "MC", label: "Monaco 🇲🇨" },
    { value: "MD", label: "Moldova 🇲🇩" },
    { value: "ME", label: "Montenegro 🇲🇪" },
    { value: "MG", label: "Madagascar 🇲🇬" },
    { value: "MH", label: "Marshall Islands 🇲🇭" },
    { value: "MK", label: "North Macedonia 🇲🇰" },
    { value: "ML", label: "Mali 🇲🇱" },
    { value: "MM", label: "Myanmar 🇲🇲" },
    { value: "MN", label: "Mongolia 🇲🇳" },
    { value: "MR", label: "Mauritania 🇲🇷" },
    { value: "MT", label: "Malta 🇲🇹" },
    { value: "MU", label: "Mauritius 🇲🇺" },
    { value: "MV", label: "Maldives 🇲🇻" },
    { value: "MW", label: "Malawi 🇲🇼" },
    { value: "MX", label: "Mexico 🇲🇽" },
    { value: "MY", label: "Malaysia 🇲🇾" },
    { value: "MZ", label: "Mozambique 🇲🇿" },
    { value: "NA", label: "Namibia 🇳🇦" },
    { value: "NE", label: "Niger 🇳🇪" },
    { value: "NG", label: "Nigeria 🇳🇬" },
    { value: "NI", label: "Nicaragua 🇳🇮" },
    { value: "NL", label: "Netherlands 🇳🇱" },
    { value: "NO", label: "Norway 🇳🇴" },
    { value: "NP", label: "Nepal 🇳🇵" },
    { value: "NR", label: "Nauru 🇳🇷" },
    { value: "NZ", label: "New Zealand 🇳🇿" },
    { value: "OM", label: "Oman 🇴🇲" },
    { value: "PA", label: "Panama 🇵🇦" },
    { value: "PE", label: "Peru 🇵🇪" },
    { value: "PG", label: "Papua New Guinea 🇵🇬" },
    { value: "PH", label: "Philippines 🇵🇭" },
    { value: "PK", label: "Pakistan 🇵🇰" },
    { value: "PL", label: "Poland 🇵🇱" },
    { value: "PS", label: "Palestine State 🇵🇸" },
    { value: "PT", label: "Portugal 🇵🇹" },
    { value: "PW", label: "Palau 🇵🇼" },
    { value: "PY", label: "Paraguay 🇵🇾" },
    { value: "QA", label: "Qatar 🇶🇦" },
    { value: "RO", label: "Romania 🇷🇴" },
    { value: "RS", label: "Serbia 🇷🇸" },
    { value: "RU", label: "Russia 🇷🇺" },
    { value: "RW", label: "Rwanda 🇷🇼" },
    { value: "SA", label: "Saudi Arabia 🇸🇦" },
    { value: "SB", label: "Solomon Islands 🇸🇧" },
    { value: "SC", label: "Seychelles 🇸🇨" },
    { value: "SD", label: "Sudan 🇸🇩" },
    { value: "SE", label: "Sweden 🇸🇪" },
    { value: "SG", label: "Singapore 🇸🇬" },
    { value: "SI", label: "Slovenia 🇸🇮" },
    { value: "SK", label: "Slovakia 🇸🇰" },
    { value: "SL", label: "Sierra Leone 🇸🇱" },
    { value: "SM", label: "San Marino 🇸🇲" },
    { value: "SN", label: "Senegal 🇸🇳" },
    { value: "SO", label: "Somalia 🇸🇴" },
    { value: "SR", label: "Suriname 🇸🇷" },
    { value: "SS", label: "South Sudan 🇸🇸" },
    { value: "ST", label: "Sao Tome and Principe 🇸🇹" },
    { value: "SV", label: "El Salvador 🇸🇻" },
    { value: "SY", label: "Syria 🇸🇾" },
    { value: "SZ", label: "Eswatini 🇸🇿" },
    { value: "TD", label: "Chad 🇹🇩" },
    { value: "TG", label: "Togo 🇹🇬" },
    { value: "TH", label: "Thailand 🇹🇭" },
    { value: "TJ", label: "Tajikistan 🇹🇯" },
    { value: "TL", label: "Timor-Leste 🇹🇱" },
    { value: "TM", label: "Turkmenistan 🇹🇲" },
    { value: "TN", label: "Tunisia 🇹🇳" },
    { value: "TO", label: "Tonga 🇹🇴" },
    { value: "TR", label: "Türkiye 🇹🇷" },
    { value: "TT", label: "Trinidad and Tobago 🇹🇹" },
    { value: "TV", label: "Tuvalu 🇹🇻" },
    { value: "TZ", label: "Tanzania 🇹🇿" },
    { value: "UA", label: "Ukraine 🇺🇦" },
    { value: "UG", label: "Uganda 🇺🇬" },
    { value: "US", label: "United States 🇺🇸" },
    { value: "UY", label: "Uruguay 🇺🇾" },
    { value: "UZ", label: "Uzbekistan 🇺🇿" },
    { value: "VA", label: "Holy See 🇻🇦" },
    { value: "VC", label: "Saint Vincent and the Grenadines 🇻🇨" },
    { value: "VE", label: "Venezuela 🇻🇪" },
    { value: "VN", label: "Vietnam 🇻🇳" },
    { value: "VU", label: "Vanuatu 🇻🇺" },
    { value: "WS", label: "Samoa 🇼🇸" },
    { value: "YE", label: "Yemen 🇾🇪" },
    { value: "ZA", label: "South Africa 🇿🇦" },
    { value: "ZM", label: "Zambia 🇿🇲" },
    { value: "ZW", label: "Zimbabwe 🇿🇼" },
];
const SignUpForm = () => {
    const [error, setError] = useState('');
    const router = useRouter();
    return (<div className={styles.login_box + ' card p-5 '}>
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
                        router.push('/login');
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
                
                <div className='row g-3'>
                    <div className='col-md-8'>
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                    <div className='col-md-4'>
                        <a href='./login'>Login</a>
                    </div> 
                </div>
            </Form>
        </Formik>
    </div>);
}

export default SignUpForm;
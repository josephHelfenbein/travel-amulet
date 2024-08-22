'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import axios from "axios";
import { countryOptions } from "./countryoptions";
import styles from './login-form.module.css';
import {fetchCountryData, gptRequest, newResult} from '../../lib/http';
import { SyncLoader } from "react-spinners";
import { GoogleMap, MarkerF, useLoadScript} from '@react-google-maps/api';
import React, {useMemo} from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const countriesMap = new Map();
for(let i=0; i<countryOptions.length; i++){
    const newName = countryOptions[i].label.substring(0, countryOptions[i].label.length-5);
    countriesMap.set(countryOptions[i].value, newName);
}
function countryCodeToName(code:string){
    return countriesMap.get(code);
}

const PlacesAutocomplete = ({onAddressSelect}:{onAddressSelect?:(address:string)=>void;}) =>{
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        cache: 86400,
    });

    const renderSuggestions = () => {
        return data.map((suggestion) => {
            const {
            place_id,
            structured_formatting: { main_text, secondary_text },
            description,
            } = suggestion;

            return (
            <li
                key={place_id}
                onClick={() => {
                setValue(description, false);
                clearSuggestions();
                onAddressSelect && onAddressSelect(description);
                }}
            >
                <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
            );
        });
    };

    return (
    <div className={styles.autocompleteWrapper}>
        <input
        value={value}
        className={styles.autocompleteInput}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="123 Stariway To Heaven"
        />

        {status === 'OK' && (
        <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
        )}
    </div>
    );
}


export default function HotelsContent(){
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

    const [countryIndex, setCountryIndex] = useState(0);

    useEffect(()=>{
        const indexCountry = Number(localStorage.getItem("index"));
        setCountryIndex(indexCountry);
        const tempCountry = JSON.parse(localStorage.getItem("country")!);
        if (!tempCountry) router.push("/quiz");
        setFoundCountry(tempCountry![indexCountry]);
    }, []);

    const [lat, setLat] = useState(27.672932021393862);
    const [lng, setLng] = useState(85.31184012689732);

    useEffect(()=>{
        if(foundCountry!=="") {
            try{
                const data = JSON.parse(localStorage.getItem("cities")!);
                const index = Number(localStorage.getItem("mapIndex"));
                setLat(data[index].lat);
                setLng(data[index].lng);
            }
            catch(e){
               router.push('/results');
            }
            
            
        }
    }, [foundCountry]);

    
    // Add lat, lng as dependencies
    const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

    const libraries = useMemo(() => ['places'], []);

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
        disableDefaultUI: true,
        clickableIcons: true,
        scrollwheel: false,
        }),
        []
    );


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
        libraries: libraries as any,
    });

    if(!isLoaded) return <p>Loading...</p>;
    return (
        <div>
            <PlacesAutocomplete 
                onAddressSelect={(address)=>{
                    getGeocode({address:address}).then((results)=>{
                        const {lat, lng} = getLatLng(results[0]);
                        setLat(lat);
                        setLng(lng);
                    })
                }}
            />
            <GoogleMap
                options={mapOptions}
                zoom={14}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '80vw', height: '400px' }}
                onLoad={() => console.log('Map Component Loaded...')}
            >
                <MarkerF position={mapCenter} />
            </GoogleMap>
        </div>
    );
}
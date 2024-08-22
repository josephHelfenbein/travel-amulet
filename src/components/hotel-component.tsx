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
import {Tooltip, IconButton} from "@mui/material";

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
        placeholder="Please enter your city or address to find the closest airport."
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
        try{
            const indexCountry = Number(localStorage.getItem("index"));
            setCountryIndex(indexCountry);
            const tempCountry = JSON.parse(localStorage.getItem("country")!);
            if (!tempCountry) router.push("/quiz");
            setFoundCountry(tempCountry![indexCountry]);
        }
        catch{
            router.push("/results");
        }
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
    const cityLocation = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

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
    const[addressLoc, setLoc] = useState([0.0, 0.0]);
    const addressFind = useMemo(() => ({ lat: addressLoc[0], lng: addressLoc[1] }), [addressLoc]);
    const mapCenter = useMemo(()=>{
        if(addressLoc[0]==0.0&&addressLoc[1]==0.0) return{lat, lng};
        else return {lat:(lat+addressLoc[0])/2, lng:(lng+addressLoc[1])/2};
        }, [addressLoc, lat, lng]);
    const zoomAmount = useMemo(()=>{
        if(addressLoc[0]==0.0&&addressLoc[1]==0.0) return 12;
        else return Math.min(8/Math.pow(Math.pow(lat - addressLoc[0], 2)+Math.pow(lng - addressLoc[1], 2),1/8), 11);
    }, [addressLoc, lat, lng]);
    if(!isLoaded) return <p>Loading...</p>;
    return (
        <div>
            <div className="d-flex justify-content-center mb-3">
                <Tooltip title="Any address you type will not be saved." placement="bottom">
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
                <PlacesAutocomplete 
                    onAddressSelect={(address)=>{
                        getGeocode({address:address}).then((results)=>{
                            const {lat:latNew, lng:lngNew} = getLatLng(results[0]);
                            setLoc([latNew, lngNew]);
                        })
                    }}
                />
                
            </div>
           <div className={styles.googleMap}>
               <GoogleMap
                    options={mapOptions}
                    zoom={zoomAmount}
                    center={mapCenter}
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                    mapContainerStyle={{ width: '80vw', height: '400px', boxShadow: '0px 5px 15px #c3ccca', borderRadius:'20px', border:'2px solid #e4e4e4' }}
                    onLoad={() => console.log('Map Component Loaded...')}
                >
                    <MarkerF position={cityLocation} />
                    {addressLoc[0]!=lat && addressLoc[1]!=lng&&
                        <MarkerF position={addressFind} />
                    }
                </GoogleMap>
           </div>
           
        </div>
    );
}
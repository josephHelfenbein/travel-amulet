'use client';
import {useRouter} from "next/router";
import {useSession} from 'next-auth/react';
import { useState, useEffect } from "react";
import axios from "axios";
import { countryOptions } from "./countryoptions";
import styles from './login-form.module.css';
import {fetchCountryData, gptRequest, newResult} from '../../lib/http';
import { PuffLoader } from "react-spinners";
import { GoogleMap, Marker, MarkerF, useLoadScript } from '@react-google-maps/api';
import React, {useMemo} from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {Tooltip, IconButton} from "@mui/material";
import { findAirport, findFlights } from "../../lib/http";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import TextField from '@mui/material/TextField';

const countriesMap = new Map();
for(let i=0; i<countryOptions.length; i++){
    const newName = countryOptions[i].label.substring(0, countryOptions[i].label.length-5);
    countriesMap.set(countryOptions[i].value, newName);
}
function countryCodeToName(code:string){
    return countriesMap.get(code);
}
function flightsListing(flights:string, setError:Function){
    const router = useRouter();
    const dataArr = JSON.parse(flights);
    let returnList = [<h5 key='0' className="bd-highlight" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Found plane ticket prices (least to most expensive)</h5>];
    let currentKey=1;
    for(let i=0; i<dataArr.length; i++){
        if(dataArr[i])
        returnList.push(
            <div key={`${currentKey++}`} style={{backgroundColor:'#fefefe', borderRadius: '10px', borderStyle: 'solid', border: '2px solid #e4e4e4'}} className="d-flex justify-content-center mb-1 p-3 pb-1">
                <p key={`${currentKey++}`} style={{fontWeight:400}} >{'$'+dataArr[i].price.grandTotal+' '+dataArr[i].price.currency}</p>
            </div>
        )
    }
    return returnList;
}
interface Hotel {
    name: string;
    address: string;
    lat: number;
    lng: number;
}
function hotelsListing(hotels:Hotel[], setError:Function){
    let returnList = [<h5 key='0' className="bd-highlight" style={{textAlign:'center', fontWeight:400, color:'#505050'}}>Found nearby hotels</h5>];
    let currentKey=1;
    for(let i=0; i<hotels.length; i++){
        if(hotels[i])
        returnList.push(
            <div key={`${currentKey++}`} style={{backgroundColor:'#fefefe', borderRadius: '10px', borderStyle: 'solid', border: '2px solid #e4e4e4'}} className="d-flex justify-content-between mb-1 p-3 pb-1">
                <p key={`${currentKey++}`} style={{fontWeight:400}} >{hotels[i].name}</p>
                <a key={`${currentKey++}`} target="_blank" href={`https://www.google.com/search?q=${hotels[i].name} at ${hotels[i].address}`} id={styles.primary} className={styles.buttonQuiz + ' p-2'} style={{width:'200px', textAlign:'center', color:'white', textDecoration:'none', fontWeight:500}}>Search for hotel</a>
            </div>
        )
    }
    return returnList;
}
function hotelsListingMarkers(hotels:Hotel[], setError:Function){
    let returnList:React.JSX.Element[] = [];
    let currentKey = 0;
    for(let i=0; i<hotels.length; i++){
        if(hotels[i])
        returnList.push(
            <MarkerF key={`${currentKey++}`} position={{lat:hotels[i].lat, lng:hotels[i].lng}} icon={{
                path:"M280-240h40v-60h320v60h40v-160q0-33-23.5-56.5T600-480H460v140H320v-180h-40v280Zm110-120q21 0 35.5-14.5T440-410q0-21-14.5-35.5T390-460q-21 0-35.5 14.5T340-410q0 21 14.5 35.5T390-360ZM160-120v-480l320-240 320 240v480H160Zm80-80h480v-360L480-740 240-560v360Zm240-270Z",
                fillColor: "#ee55ee",
                fillOpacity:1,
                anchor:new google.maps.Point(
                    480, -480
                ),
                strokeWeight:1,
                strokeColor:"#993399",
                scale:0.02,
                
            }} title={hotels[i].name} />
        )
    }
    return returnList;
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
        placeholder="Please enter your city address."
        />

        {status === 'OK' && (
        <ul className={styles.suggestionWrapper}>{renderSuggestions()}</ul>
        )}
    </div>
    );
}


export default function HotelsContent(){
    const [findError, setFindError] = useState('');
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

    const [lat, setLat] = useState(0.0);
    const [lng, setLng] = useState(0.0);
    const [cityName, setCityName] = useState('');

    useEffect(()=>{
        if(foundCountry!=="") {
            try{
                const data = JSON.parse(localStorage.getItem("cities")!);
                const index = Number(localStorage.getItem("mapIndex"));
                setLat(data[index].lat);
                setLng(data[index].lng);
                setCityName(data[index].name);
            }
            catch(e){
               router.push('/results');
            }
        }
    }, [foundCountry]);

    let hotels: Hotel[] = [];
    const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
    useEffect(()=>{
        if(cityName!==''){
            axios.get('/api/findHotels', {
                params: {
                    query: `${cityName}`
                }
            }).then((res) => {
                let list = res.data;
                if(hotels.length==0){
                    for (let i = 0; i < Math.min(list.length, 8); i++) {
                        hotels.push({
                            "name": list[i].name,
                            "address": list[i].formatted_address,
                            "lat": list[i].geometry.location.lat,
                            "lng": list[i].geometry.location.lng,
                        });
                    }
                    setHotelsList(hotels);
                }
            }).catch((e)=>{
                setFindError('Could not find hotels.');
            })
        }
    }, [cityName]);
    
    
    const cityLocation = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

    const libraries = useMemo(() => ['places'], []);

    const mapOptions = useMemo<google.maps.MapOptions>(
        () => ({
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: true,
        scrollwheel: false,
        }),
        []
    );
    const [airportDes, setAirportDes] = useState({lat:0.0, lng:0.0});
    const [iataCode, setIataCode] = useState({iataCode:'', name:''});
    
    useEffect(()=>{
        if(lat!=0.0&&lng!=0.0){
            findAirport({lat:lat, lng:lng}).then((res)=>{
                if(res){
                    const airportInfo = JSON.parse(res.content!);
                    const airport = airportInfo.data[0];
                    setAirportDes({lat:airport.geoCode.latitude, lng:airport.geoCode.longitude});
                    setIataCode({iataCode:airport.iataCode, name:airport.name});
                    setFindError('Found nearby airport! '+airport.name);
                }
            }).catch((e)=>{
                setFindError('Sorry, no nearby airports could be found.');
                console.error(e);
            })
        }
    }, [lat, lng]);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
        libraries: libraries as any,
    });
    const[addressLoc, setLoc] = useState([0.0, 0.0]);
    const addressFind = useMemo(() => ({ lat: addressLoc[0], lng: addressLoc[1] }), [addressLoc]);
    const[nearbyAirportLoc, setNearbyAirportLoc] = useState({lat:0.0, lng:0.0, iataCode:'', name:''});
    const nearbyAirport = useMemo(()=>{
        if(addressLoc[0]==0.0&&addressLoc[1]==0.0) return {lat:0.0, lng:0.0, iataCode: '', name:''};
        else{
            findAirport({lat:addressLoc[0], lng:addressLoc[1]}).then((res)=>{
                if(res){
                    const airportInfo = JSON.parse(res.content!);
                    const airport = airportInfo.data[0];
                    setNearbyAirportLoc({lat: airport.geoCode.latitude, lng:airport.geoCode.longitude, iataCode:airport.iataCode, name:airport.name});
                    setFindError('Found nearby airport! '+airport.name);
                    return {lat: airport.geoCode.latitude, lng:airport.geoCode.longitude, iataCode:airport.iataCode, name:airport.name};
                }
            }).catch((e)=>{
                setFindError('Sorry, no nearby airports could be found.');
                console.error(e);
                return {lat:0.0, lng:0.0, iataCode: '', name:''};
            })
        }
    }, [addressLoc]);
    const airportFind = useMemo(()=>({lat: airportDes.lat, lng:airportDes.lng}), [airportDes]);
    const mapCenter = useMemo(()=>{
        if(addressLoc[0]==0.0&&addressLoc[1]==0.0) {
            if(airportDes.lat==0.0 && airportDes.lng==0.0)
                return{lat:lat, lng:lng};
            else return {lat:(lat+airportDes.lat)/2, lng:(lng+airportDes.lng)/2};
        }
        else return {lat:(lat+addressLoc[0])/2, lng:(lng+addressLoc[1])/2};
        }, [addressLoc, lat, lng, airportDes]);
    const zoomAmount = useMemo(()=>{
        if(addressLoc[0]==0.0&&addressLoc[1]==0.0) {
            if(airportDes.lat==0.0 && airportDes.lng==0.0)
                return 12;
            else return Math.min(8/Math.pow(Math.pow(lat - airportDes.lat, 2)+Math.pow(lng - airportDes.lng, 2),1/8), 11);
        }
        else return Math.min(8/Math.pow(Math.pow(lat - addressLoc[0], 2)+Math.pow(lng - addressLoc[1], 2),1/8), 11);
    }, [addressLoc, lat, lng, airportDes]);
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];
    const [startDate, setStartDate] = useState<Value>(new Date());
    const [endDate, setEndDate] = useState<Value>(null);
    const [adultTravelers, setAdultTravelers] = useState(1);
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [flightsList, setFlightsList] = useState('');
    if(!isLoaded) return <div style={{zIndex:"500"}}  className='d-flex position-fixed justify-content-center p-3'>
                            <PuffLoader color="#b4b4b4" size={100} className='position-fixed top-50 start-50 translate-middle' />
                        </div>;
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
            <GoogleMap
                options={mapOptions}
                zoom={zoomAmount}
                center={mapCenter}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{ width: '80vw', height: '500px', boxShadow: '0px 5px 15px #c3ccca', borderRadius:'20px', border:'2px solid #e4e4e4' }}
                onLoad={() => console.log('Map Component Loaded...')}
            >
                <MarkerF position={cityLocation} title="City Center" />
                {addressLoc[0]!=0.0 && addressLoc[1]!=0.0&&
                    <MarkerF position={addressFind} />
                }
                {airportDes.lat!=0.0 && airportDes.lng!=0.0 && 
                    <MarkerF position={airportFind} icon={{
                        path:"m397-115-99-184-184-99 71-70 145 25 102-102-317-135 84-86 385 68 124-124q23-23 57-23t57 23q23 23 23 56.5T822-709L697-584l68 384-85 85-136-317-102 102 26 144-71 71Z",
                        fillColor: "#5555ff",
                        fillOpacity:1,
                        anchor:new google.maps.Point(
                            480, -480
                        ),
                        strokeWeight:2,
                        strokeColor:"#3333ee",
                        scale:0.035,
                        
                    }} title="Airport" />
                }
                {nearbyAirportLoc.lat!=0.0 && nearbyAirportLoc.lng!=0.0 && 
                    <MarkerF position={{lat:nearbyAirportLoc.lat, lng:nearbyAirportLoc.lng}} icon={{
                        path:"m397-115-99-184-184-99 71-70 145 25 102-102-317-135 84-86 385 68 124-124q23-23 57-23t57 23q23 23 23 56.5T822-709L697-584l68 384-85 85-136-317-102 102 26 144-71 71Z",
                        fillColor: "#5555ff",
                        fillOpacity:1,
                        anchor:new google.maps.Point(
                            480, -480
                        ),
                        strokeWeight:2,
                        strokeColor:"#3333ee",
                        scale:0.035,
                        
                    }} title="Airport" />
                }
                {
                    hotelsList.length!=0 && hotelsListingMarkers(hotelsList, setFindError)
                }
            </GoogleMap>
                {findError!=='' && 
                    <p style={{width:'80vw'}}>{findError}</p>
                }
                {loadingResponse && 
                    <div style={{zIndex:"500"}}  className='d-flex position-fixed justify-content-center p-3'>
                        <PuffLoader color="#444494" size={100} className='position-fixed top-50 start-50 translate-middle' />
                    </div>
                }
                {iataCode.iataCode!=''&&nearbyAirportLoc.iataCode!=''&& 
                    <div className="m-2">
                        {!onMobile && 
                            <div className="d-flex justify-content-center">
                                <p className="m-2">Departure:</p>
                                <DatePicker onChange={setStartDate} value={startDate} />
                                <p className="m-2">Return:</p>
                                <DatePicker onChange={setEndDate} value={endDate} />
                            </div> 
                        }
                        {onMobile && 
                            <div>
                                <div className="d-flex justify-content-center m-2">
                                <p className="m-2">Departure:</p>
                                <DatePicker onChange={setStartDate} value={startDate} />
                                </div>
                                <div className="d-flex justify-content-center m-2">
                                <p className="m-2">Return:</p>
                                <DatePicker onChange={setEndDate} value={endDate} />
                                </div>
                            </div> 
                        }
                        <TextField
                            id="standard-number"
                            label="Travelers (less than 10)"
                            type="number"
                            variant="standard"
                            value={adultTravelers}
                            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                                if(Number(event.target.value) >= 0 && Number(event.target.value) <= 9)
                                setAdultTravelers(Number(event.target.value));
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                }
                <div className="d-flex justify-content-center m-2">
                   {iataCode.iataCode!=''&&nearbyAirportLoc.iataCode!=''&& <button onClick={()=>{
                        let returnDate = endDate ? new Date(endDate!.toString()) : null;
                        let fullReturnDate:string|null = null;
                        function toDate (date:number){
                            if(date.toString().length==1) return '0' + date.toString();
                            return date.toString();
                        }
                        function toMonth(date:number){
                            const month = date + 1;
                            if(month.toString().length==1) return '0' + month.toString();
                            return month.toString();
                        }
                        if(returnDate)
                            fullReturnDate = returnDate.getFullYear()+'-'+toMonth(returnDate.getMonth())+'-'+toDate(returnDate.getDate());
                        let departDate = new Date(startDate!.toString());
                        let fullDepartDate = departDate.getFullYear()+'-'+toMonth(departDate.getMonth())+'-'+toDate(departDate.getDate());
                        setLoadingResponse(true);
                        findFlights({from:nearbyAirportLoc.iataCode, to:iataCode.iataCode, depart:fullDepartDate, return:fullReturnDate, travelers:Math.floor(adultTravelers)}).then((res)=>{
                            setLoadingResponse(false);
                            if(res.content){
                                const airportInfo = JSON.parse(res.content!);
                                if(airportInfo.data.length == 0) setFindError("Sorry, no flights could be found. The API can't track every airline, we apologize for the inconvenience. There also may be no flights between these two airports on the set date.");
                                else{
                                    setFindError('Found flight prices!');
                                    setFlightsList(JSON.stringify(airportInfo.data));
                                }
                            }
                            else setFindError('Sorry, something went wrong on the server. Check if the dates are correct.');
                        }).catch((e)=>{
                            setLoadingResponse(false);
                            setFindError('Sorry, something went wrong on the server. Check if the dates are correct. If they are, we apologize for the inconvenience.');
                        })
                    }}id={styles.primary} className={styles.buttonQuiz + ' p-3'} style={{width:'250px', color:'white', textDecoration:'none', fontWeight:500}}>Find flight prices</button>}
                    {!(iataCode.iataCode!=''&&nearbyAirportLoc.iataCode!='')&& 
                    <div id={styles.disabled} className={styles.buttonQuiz + ' p-3'} style={{width:'250px', textDecoration:'none', fontWeight:500, textAlign:'center'}}>Find flight prices</div>}
                </div>
                {
                    flightsList!=='' && flightsListing(flightsList, setFindError)
                }
                {
                    hotelsList.length!=0 && hotelsListing(hotelsList, setFindError)
                }
        </div>
    );
}
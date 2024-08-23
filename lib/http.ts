import { CountryData, User } from '@prisma/client';
import axios from 'axios';
import { StringSchema } from 'yup';
import prisma from './prisma';

export async function fetchUserExistsEmail(email: string): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const response = await axios.get(`/api/user/${email}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: true };
  } catch (error) {
    console.error(error);
    return { error, content: false };
  }
}
export async function changeUserName(params: {email: string, name: string}): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const response = await axios.put(`/api/user/${params.email}`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response?true:false };
  } catch (error) {
    console.error(error);
    return { error, content: false };
  }
}
export async function changeUserPreferences(params: {email: string, preferences: string}): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const response = await axios.put(`/api/user/${params.email}`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response?true:false };
  } catch (error) {
    console.error(error);
    return { error, content: false };
  }
}
export async function clearResults(params:{email: string, clearResults:boolean}): Promise<{
  content:User|null;
  error?:any;
}>{
  try {
    const response = await axios.put(`/api/user/${params.email}`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error, content: null };
  }
}
export async function changeUserCountry(params: {email: string, country: string}): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const response = await axios.put(`/api/user/${params.email}`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response?true:false };
  } catch (error) {
    console.error(error);
    return { error, content: false };
  }
}
export async function fetchUserByEmail(email:string): Promise<{
  content:User|null;
  error?: any;
}>{
  try {
    const response = await axios.get(`/api/user/${email}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error, content: null };
  }
}
export async function fetchCountryData(id:string): Promise<{
  content:CountryData|null;
  error?:any;
}>{
  try{
    const response = await axios.get(`/api/country/${id}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    if(!response) throw new Error('Not found!');
    return {content: response.data};
  }
  catch(error){
    console.error(error);
    return {error, content:null};
  }
}
export async function findAirport(params:{lat:number, lng:number}): Promise<{
  content:string|null;
  error?:any;
}>{
  try{
    const newParams = JSON.stringify({lat: params.lat, lng: params.lng});
    const response = await axios.get(`/api/closestAirport?query=${newParams}`);
    if(response.status !== 200){
      throw new Error(`${response.status} - ${response.data}`);
    }
    return {content: JSON.stringify(response.data)};
  }
  catch(error){
    console.error(error);
    return {error, content:null};
  }
}
export async function findFlights(params:{from:string, to:string, depart:string, return:string|null, travelers:Number}): Promise<{
  content:string|null;
  error?:any;
}>{
  try{
    const newParams = JSON.stringify({from:params.from, to:params.to, depart:params.depart, return:params.return, travelers:params.travelers});
    const response = await axios.get(`/api/findflights?query=${newParams}`);
    if(response.status !== 200){
      throw new Error(`${response.status} - ${response.data}`);
    }
    return {content:JSON.stringify(response.data)};
  }
  catch(error){
    console.error(error);
    return{error, content:null};
  }
}
export async function gptRequest(params:{prompt:string}): Promise<{
  content:string|null;
  error?:any;
}>{
  try{
    const response = await axios.post(`/api/openai`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    if(!response) throw new Error('Not found!');
    return {content: response.data};
  }
  catch(error){
    console.error(error);
    return {error, content:null};
  }
}
export async function newResult(params:{country:string, email:string}): Promise<{
  content?:boolean;
  error?:any;
}>{
  try {
    const response = await axios.put(`/api/results`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: true };
  } catch (error) {
    console.error(error);
    return { content:false, error };
  }
}
export async function postUser(
  params: {name: string, email: string, country: string, password:string, preferences:string, results:string}
): Promise<{
  content?: { userID: Number; success: boolean };
  error?: any;
}> {
  try {
    const response = await axios.post(`/api/user`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
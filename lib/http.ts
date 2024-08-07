import { User } from '@prisma/client';
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
export async function changeUserName(email: string, name: string): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const emailStr = email.toString();
    const nameStr = name.toString();
    if(!emailStr||!nameStr) throw new Error(`Incorrect strings`);
    const response = await prisma.user.update({
      where:{
        email: email,
      },
      data:{
        name:name,
      },
    })
    if (!response) {
      throw new Error(`Unable to update user`);
    }
    return { content: response?true:false };
  } catch (error) {
    console.error(error);
    return { error, content: false };
  }
}
export async function changeUserCountry(email: string, country: string): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const emailStr = email.toString();
    const countryStr = country.toString();
    if(!emailStr||!countryStr) throw new Error(`Incorrect strings`);
    const response = await prisma.user.update({
      where:{
        email: email,
      },
      data:{
        country:countryStr,
      },
    })
    if (!response) {
      throw new Error(`Unable to update user`);
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
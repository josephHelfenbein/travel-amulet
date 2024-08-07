import { User } from '@prisma/client';
import axios from 'axios';
import { StringSchema } from 'yup';

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
export async function changeUserValue(email: string, param: string, newParam: string): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const response = await axios.put(`/api/user/${email}`, {email:email, variable:param, value:newParam});
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
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
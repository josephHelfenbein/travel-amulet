import axios from 'axios';
import { StringSchema } from 'yup';

export async function fetchUserExistsEmail(email: string): Promise<{
  content: boolean;
  error?: any;
}>{
  try {
    const response = await axios.get(`/api/users/${email}`);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: true };
  } catch (error) {
    console.error(error);
    return { error, content: false };
  }
}
export async function postUser(
  params: {name: string, email: string, country: string, password:string}
): Promise<{
  content?: { userID: Number; success: boolean };
  error?: any;
}> {
  try {
    const response = await axios.post(`/api/users`, params);
    if (response.status !== 200) {
      throw new Error(`${response.status} - ${response.data}`);
    }
    return { content: response.data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
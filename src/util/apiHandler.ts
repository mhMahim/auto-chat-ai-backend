import env from "../util/validateEnv";
import axios from "axios";
import { DeleteMediaResponse, errorMediaResponse, ErrorResponse, ListBody, mediaResponse, SingleList } from "./types";
import fs from 'fs';
import FormData from 'form-data';


const token=env.TOKEN;
const version=env.VERSION;
const phone_no_id=env.PHONE_NO_ID;

//# This is for sending Text Messages
export async function sendTextMessage(to: string,msg:string): Promise<boolean> {
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            to: to,
            text:{
                body:""+msg
            }
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}


//# This is for sending Text Messages
export async function sendMarkAsRead(MsgId: string): Promise<boolean> {
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            status: "read",
            message_id: MsgId
            }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}


//media messages
export async function uploadMediaFile(filePath: string): Promise<any> {
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', fs.createReadStream(filePath));
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${version}/${phone_no_id}/media`,
      headers: {
        'Authorization': 'Bearer ' +token,
        'Cookie': 'ps_l=1; ps_n=1',
        'content-type': 'multipart/form-data',
        ...formData.getHeaders()
      },
      data: formData
    };
  
    try {
      const response = await axios.request(config);
      console.log(response.data);
      return response.data;

    } catch (error) {
      console.log(error);
      return error;
    }
}

export async function getMediaURLFromMediaID(mediaId: string): Promise<mediaResponse|errorMediaResponse> {
    try {
        const response = await axios.get(`https://graph.facebook.com/${version}/${mediaId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
         });

         // Check if the response contains the expected fields
        if ('url' in response.data) {
            return response.data as mediaResponse;
        } else {
            return { error: "Unexpected response format" };
        }

    } catch (error) {
        // If an error occurs, log it and return a structured error response
        console.error("Error getting media link:", error);

        // Type assertion for AxiosError
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || "Media not found" };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}

  //getMediaURLFromMediaURL
export async function downloadMediaFromURL(mediaUrl: string): Promise<any> {
    try {
  
        const mediaResponse = await axios.get(mediaUrl, {
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer',
          responseEncoding: 'binary'
  
      });
  
      console.log("data # ",mediaResponse.data);
      return mediaResponse.data;
  
      } catch (error) {
         // If an error occurs, log it and return a server error
         console.error('Error downloadMediaFromURL ', error);
         return error;
      }
}



type DeleteMediaResult = DeleteMediaResponse | ErrorResponse;

export async function deleteMediaUsingId(mediaId: string): Promise<DeleteMediaResult> {
    try {
        const response = await axios.delete(`https://graph.facebook.com/${version}/${mediaId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        });

        console.log("data # ", response.data);
        return response.data as DeleteMediaResponse;

    } catch (error) {
        // If an error occurs, log it and return a structured error response
        console.error('Error deleting media:', error);

        // Type assertion for AxiosError
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || 'Failed to delete media' };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
}


export const reqAccessToken = async (code: string) => {

  console.log("reqAccessToken starting");

  const version = "v22.0"; 
  const client_id = "753653720779184";
  const client_secret = "f5b20b78d1b708d483b11051595bfa59z";


  try {
    const url = `https://graph.facebook.com/${version}/oauth/access_token`;

      const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code"
        }),
      headers: {"Content-Type": "application/json"},
    });

    const data = await response.json();     

    console.log("reqAccessToken token - ", data.access_token);

    return data.access_token;
  } catch (error) {
    console.log("reqAccessToken error ",error);
    return null;
  }
};

export const businessInformation = async(token:any)=>{
  console.log("businessInformation starting");

    try {
        const SYSTEM_ACCESS_TOKEN =process.env.TOKEN;
        const url =   `https://graph.facebook.com/${version}/debug_token?input_token=${token}&access_token=${SYSTEM_ACCESS_TOKEN}`
        const response = await fetch(url, {
            headers: {
              Accept: "application/json",
            },
            method: "GET",
        });
    
        const data = await response.json();
        console.log("businessInformation data ",data);
        
    } catch (error) {
        console.log("businessInformation error ",error);
        return null;
    }
  
}
  
export const getAppInfo = async(token:any,bussinessId:string)=>{

  console.log("getAppInfo starting");
  
    try {
        const url = `https://graph.facebook.com/${version}/${bussinessId}?fields=phone_numbers&access_token=${token}`;
      
        const response = await fetch(url, {
        headers: {
          Accept: "application/json"
        },
        method: "GET",
     });
   
      const data = await response.json();
      console.log("getAppInfo data ",data);

    } catch (error) {
      console.log("getAppInfo error ", error);
      return null;
    }
}
  
export const getPhoneNumberInfo = async(token:any,bussinessId:string)=>{
  console.log("getPhoneNumberInfo starting");
  
      try {
        const url = `https://graph.facebook.com/${version}/${bussinessId}/phone_numbers?access_token=${token}&sort=['last_onboarded_time_ascending']`;
        
            const response = await fetch(url, {
            headers: {
              Accept: "application/json",
              // Authorization: Bearer ${token},
            },
            method: "GET",
          });
        
           const data = await response.json();
           console.log("getPhoneNumberInfo data ",data);
           return data.data[0];

      } catch (error) {
        console.log("getPhoneNumberInfo error ",error);
        return null;
      }
}
  
export const registerPhoneNumber = async(token:string,phoneNumberId:string)=>{
  
  console.log("registerPhoneNumber start");

      try {
        const url = `https://graph.facebook.com/${version}/${phoneNumberId}/register?access_token=${token}`;
     
        const response = await fetch(url, {
          headers: {
              "Content-Type": "application/json",
          },
          method: "POST",
          body:JSON.stringify({
              "messaging_product": "whatsapp", 
              "pin": "212834" 
          })
       });
     
        const data = await response.json();
        console.log("registerPhoneNumber data ",data);
        return data;

      } catch (error) {
        console.log("registerPhoneNumber error ",error);
        return null;
      }  

}
  
export const subscribeApp = async(token:any,bussinessId:string)=>{
  console.log("subscribeApp starting");

    try {
      const url = `https://graph.facebook.com/${version}/${bussinessId}/subscribed_apps`;
     
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
       });
     
      const data = await response.json();
      console.log("subscribeApp data - ", data);
      return data;

    } catch (error) {

      console.log("subscribeApp error ",error);
      return null;
    }
    
}
  
  
  
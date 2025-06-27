import Vapi from "@vapi-ai/web"
const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY! ;
export const vapi = new Vapi(apiKey) ;
console.log("vapi",vapi);
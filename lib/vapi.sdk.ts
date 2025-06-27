import Vapi from "@vapi-ai/web"
const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY! ;
console.log(console.log("VAPI Key:", apiKey));
export const vapi = new Vapi(apiKey) ;
console.log("vapi",vapi);
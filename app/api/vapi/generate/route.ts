import { NextRequest } from "next/server";
import {generateText} from "ai"
import {google} from "@ai-sdk/google"
import { json } from "stream/consumers";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
    return Response.json({success:true,message:"Thank You"},{status:200}) ;
}

export async function POST(req:Request) {
    const {type, role,techstack,level,amount,userid} = await req.json() ;
    console.log(type,role,techstack,level,amount,userid);
    try {
        const {text:questions} = await generateText({
            model:google("gemini-2.0-flash-001"),
            prompt:`Prepare questions for job interview. The job role is ${role}. The job experience level is ${level}. The techstack used in the job is ${techstack}. The focus between behavioural and technical questions should lean towards: ${type}. The amount of questions required is ${amount}. Please return the questions, without additional text. The questions are going to read by a voice assistance so do not use "/" or "*" or any other special characters which might break voice assistance. Return the questions formatted like this: ["Question 1","Question 2", "Question 3"]  Thank You! <3`
        });

        const interview = {
            role, type, level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions) ,
            userId :userid,
            finalized:true,
            coverImage:getRandomInterviewCover(),
            createdAt: new Date().toISOString() 
        }
        await db.collection("interviews").add(interview) ;
        return Response.json({success:true},{status:200});
    } catch (error) {
        console.log(error) ;
        Response.json({success:false,message:"Internal server error."},{status:500}) ;
    }
}
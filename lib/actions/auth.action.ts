"use server"

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { email, uid, name } = params;

    try {
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
            return { success: false, message: "user already exists." };
        }
        await db.collection("users").doc(uid).set({
            name, email
        })
        return {
            success: true,
            message: "Account created successfully. Please sign in."
        }
    } catch (error: any) {
        console.log("Error creating user : ", error);
        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "Email already eixsts."
            }
        }

        return {
            success: false,
            message: "failed to create an account."
        }
    }
}

export async function signIn(params: SignInParams) {
    const { idToken, email } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: "User not exists."
            }
        }
        await setSessionCookie(idToken);
        return {
            success: true,
            message: "Signed in successfully."
        }
    } catch (error) {
        console.log("Error while sign in :", error);
        return {
            success: false,
            message: "Internal server error.",
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax"
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
        if (!userRecord) return null;
        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function getInterviewByUserId(userId: string): Promise<Interview[]> {
    const interviews = await db.collection("interviews").where("userId", "==", userId).orderBy("createdAt", "desc").get();
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params:GetLatestInterviewsParams): Promise<Interview[]> {
    const {userId, limit} = params ;

    const interviews = await db.collection("interviews").orderBy("createdAt","desc").where("finalized","==",true).where("userId","!=",userId).limit(limit!).get() ;

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data(),
    })) as Interview[] ;
}
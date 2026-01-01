"use server"

import prisma from "@/lib/prisma"

export async function getAllServices({ userId }: { userId: string }) {

    if (!userId) {
        return{
            error: "User ID is required",
        }
    }

    try{
        const services = await prisma.service.findMany({
            where:{
                userId: userId,
                status: true
            }
        })
        return{
            data: services
        }
    }catch(err){
        return{
            error: "User ID is required",
        }
    }
}
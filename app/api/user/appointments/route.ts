export const runtime = "nodejs";

import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    if (!userEmail) {
        return new Response(JSON.stringify({ message: "email is required" }), { status: 400 });
    }

    try {
        const endpoint = `${API_BASE_URL}/api/appointments/client?email=${encodeURIComponent(userEmail)}`;
        
        const response = await axios.get(endpoint, {
            headers: { "ngrok-skip-browser-warning": "69420" }
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Backend fetch failed:', err.message);
        
        return new Response(
            JSON.stringify({ success: false, message: "Failed to fetch appointments" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}


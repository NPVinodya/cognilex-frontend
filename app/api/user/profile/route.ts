export const runtime = "nodejs";

import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export async function PATCH(req: Request) {
    const body = await req.json();

    try {
        const response = await axios.patch(
            `${API_BASE_URL}/profile`,
            {
                email: body.email,
                name: body.name,
                avatar_url: body.avatar_url
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Update profile error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Update failed" }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

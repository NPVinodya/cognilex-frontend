export const runtime = "nodejs";

import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
        return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
    }

    try {
        const response = await axios.delete(`${API_BASE_URL}/profile/${email}`, {
            headers: {
                "ngrok-skip-browser-warning": "69420"
            }
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Delete account error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Deletion failed" }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

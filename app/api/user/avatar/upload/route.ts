export const runtime = "nodejs";

import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const email = formData.get("email") as string;
        const file = formData.get("file") as File;

        if (!email || !file) {
            return new Response(JSON.stringify({ message: "Email and file are required" }), { status: 400 });
        }

        // Forward the multipart form data to the Python backend
        const backendFormData = new FormData();
        backendFormData.append("file", file);

        const response = await axios.post(
            `${API_BASE_URL}/avatar/upload?email=${encodeURIComponent(email)}`,
            backendFormData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "ngrok-skip-browser-warning": "69420"
                },
            }
        );

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Avatar upload proxy error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Upload failed" }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

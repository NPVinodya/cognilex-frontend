export const runtime = "nodejs";

import axios from "axios";

export async function PATCH(req: Request) {
    const body = await req.json();

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await axios.patch(
            `${baseUrl}/password`,
            {
                email: body.email,
                current_password: body.currentPassword,
                new_password: body.newPassword
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
        console.error('Update password error:', err.response?.status, err.message, err.response?.data);
        return new Response(
            JSON.stringify({ 
                message: err.response?.data?.detail || err.message || "Update password failed",
                full_error: err.response?.data 
            }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

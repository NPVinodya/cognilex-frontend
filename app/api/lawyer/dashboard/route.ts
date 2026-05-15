export const runtime = "nodejs";

import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lawyerId = searchParams.get("lawyerId");
    const type = searchParams.get("type") || "stats";
    const status = searchParams.get("status") || "all";
    const period = searchParams.get("period") || "this-month";

    if (!lawyerId) {
        return new Response(JSON.stringify({ message: "lawyerId is required" }), { status: 400 });
    }

    try {
        let endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/stats`;

        if (type === "appointments") endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/appointments`;
        if (type === "all-appointments") endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/all-appointments?status=${status}`;
        if (type === "bookings") {
            const clientEmail = searchParams.get("clientEmail");
            endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/bookings${clientEmail ? `?client_email=${encodeURIComponent(clientEmail)}` : ""}`;
        }
        if (type === "clients") endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/clients`;
        if (type === "documents") endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/documents`;
        if (type === "slot") {
            const slotId = searchParams.get("slotId");
            endpoint = `${API_BASE_URL}/lawyer-dashboard/slot/${slotId}`;
        }
        if (type === "analytics") {
            endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/bookings?type=analytics&period=${period}`;
        }
        if (type === "stats") {
            endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/bookings?type=stats`;
        }
        if (type === "cases") {
            endpoint = `${API_BASE_URL}/lawyer-dashboard/${lawyerId}/cases`;
        }
        // Add more types as needed

        const response = await axios.get(endpoint, {
            headers: { "ngrok-skip-browser-warning": "69420" }
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Lawyer dashboard fetch error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Fetch failed" }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { appointmentId, caseId, ...updateData } = body;

        // 1. Handling Case Updates
        if (caseId) {
            const response = await axios.patch(`${API_BASE_URL}/lawyer-dashboard/case/${caseId}`, updateData, {
                headers: { 
                    "ngrok-skip-browser-warning": "69420",
                    "Content-Type": "application/json"
                }
            });
            return new Response(JSON.stringify(response.data), { status: response.status });
        }

        // 2. Handling Appointment Status (existing logic)
        if (!appointmentId || !body.status) {
            return new Response(JSON.stringify({ message: "Required fields missing" }), { status: 400 });
        }

        const response = await axios.patch(`${API_BASE_URL}/lawyer-dashboard/appointment/${appointmentId}/status?new_status=${body.status}`, {}, {
            headers: { "ngrok-skip-browser-warning": "69420" }
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Update error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Update failed" }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Handling Finalize Booking (from Webhook)
        if (body.slot_id && body.payment_details) {
            const response = await axios.post(`${API_BASE_URL}/lawyer-dashboard/appointment/finalize`, body, {
                headers: { "ngrok-skip-browser-warning": "69420" }
            });
            return new Response(JSON.stringify(response.data), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 3. Handling Case Creation
        if (body.type === 'create_case') {
            const { lawyerId, type, ...caseData } = body; // Destructure type so we don't send it to the Python API twice
            console.log(`[Proxy] Creating case for lawyer ${lawyerId}:`, caseData.title);
            
            const response = await axios.post(`${API_BASE_URL}/lawyer-dashboard/${lawyerId}/cases`, caseData, {
                headers: { 
                    "ngrok-skip-browser-warning": "69420",
                    "Content-Type": "application/json"
                }
            });
            return new Response(JSON.stringify(response.data), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 4. Handling Slot Creation (existing logic)
        const { lawyerId, date, time, type, location } = body;
        if (!lawyerId || !date || !time) {
            return new Response(JSON.stringify({ message: "Required fields missing" }), { status: 400 });
        }

        const response = await axios.post(`${API_BASE_URL}/lawyer-dashboard/slot`, {}, {
            params: {
                lawyer_id: lawyerId,
                date: date,
                time: time,
                type: type,
                location: location || "Office"
            },
            headers: { "ngrok-skip-browser-warning": "69420" }
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('API proxy error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Action failed" }),
            { status: err.response?.status || 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const slotId = searchParams.get("slotId");
    const caseId = searchParams.get("caseId");

    try {
        if (caseId) {
            const response = await axios.delete(`${API_BASE_URL}/lawyer-dashboard/case/${caseId}`, {
                headers: { "ngrok-skip-browser-warning": "69420" }
            });
            return new Response(JSON.stringify(response.data), { status: 200 });
        }

        if (!slotId) return new Response(JSON.stringify({ message: "slotId or caseId is required" }), { status: 400 });

        const response = await axios.delete(`${API_BASE_URL}/lawyer-dashboard/slot/${slotId}`, {
            headers: { "ngrok-skip-browser-warning": "69420" }
        });
        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: "Deletion failed" }), { status: 500 });
    }
}

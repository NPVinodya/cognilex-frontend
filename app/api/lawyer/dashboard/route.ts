export const runtime = "nodejs";

import axios from "axios";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const lawyerId = searchParams.get("lawyerId");
    const type = searchParams.get("type") || "stats"; 
    const status = searchParams.get("status") || "all";

    if (!lawyerId) {
        return new Response(JSON.stringify({ message: "lawyerId is required" }), { status: 400 });
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        let endpoint = `${baseUrl}/lawyer-dashboard/${lawyerId}/stats`;

        if (type === "appointments") endpoint = `${baseUrl}/lawyer-dashboard/${lawyerId}/appointments`;
        if (type === "all-appointments") endpoint = `${baseUrl}/lawyer-dashboard/${lawyerId}/all-appointments?status=${status}`;
        if (type === "clients") endpoint = `${baseUrl}/lawyer-dashboard/${lawyerId}/clients`;
        if (type === "documents") endpoint = `${baseUrl}/lawyer-dashboard/${lawyerId}/documents`;
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
        const { appointmentId, status } = body;

        if (!appointmentId || !status) {
            return new Response(JSON.stringify({ message: "appointmentId and status are required" }), { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await axios.patch(`${baseUrl}/lawyer-dashboard/appointment/${appointmentId}/status?new_status=${status}`, {}, {
            headers: { "ngrok-skip-browser-warning": "69420" }
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Status update error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Update failed" }),
            { status: err.response?.status || 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { lawyerId, date, time, type, location } = body;
        
        console.log('Proxy POST slot:', { lawyerId, date, time, type, location });

        if (!lawyerId || !date || !time) {
            return new Response(JSON.stringify({ message: "Required fields missing" }), { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await axios.post(`${baseUrl}/lawyer-dashboard/slot`, {}, {
            params: {
                lawyer_id: lawyerId,
                date: date,
                time: time,
                type: type,
                location: location || "Office"
            },
            headers: { "ngrok-skip-browser-warning": "69420" }
        });

        console.log('Backend response:', response.data);

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('Slot creation proxy error:', err.response?.data || err.message);
        return new Response(
            JSON.stringify({ message: err.response?.data?.detail || "Creation failed" }),
            { status: err.response?.status || 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const slotId = searchParams.get("slotId");

    if (!slotId) return new Response(JSON.stringify({ message: "slotId is required" }), { status: 400 });

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await axios.delete(`${baseUrl}/lawyer-dashboard/slot/${slotId}`, {
            headers: { "ngrok-skip-browser-warning": "69420" }
        });
        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: "Deletion failed" }), { status: 500 });
    }
}

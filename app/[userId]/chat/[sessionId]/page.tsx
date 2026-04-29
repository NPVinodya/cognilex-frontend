import { redirect } from "next/navigation";
import Chat from "@/legacy_pages/chat_page";
import { verifyUserAccess } from "@/lib/chatGuard";

export default async function ChatSessionPage({
    params,
}: {
    params: Promise<{ userId: string; sessionId: string }>;
}) {
    const { userId, sessionId } = await params;

    const verified = await verifyUserAccess(userId);
    if (!verified) {
        redirect("/login");
    }

    return (
        <Chat userId={userId} sessionId={sessionId} />
    );
}

import { redirect } from "next/navigation";
import Chat from "@/legacy_pages/chat_page";
import { verifyUserAccess } from "@/lib/chatGuard";

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    const verified = await verifyUserAccess(userId);
    if (!verified) {
        redirect("/login");
    }

    return (
        <Chat userId={userId} />
    );
}

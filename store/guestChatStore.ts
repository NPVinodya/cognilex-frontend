'use client';

/**
 * store/guestChatStore.ts
 *
 * Zustand persist store for the home-page GuestChat widget.
 * Messages and bot-response count survive page refreshes via localStorage.
 * The store is cleared after a successful registration so the messages
 * can be migrated to MongoDB under the new user's account.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Message } from '@/lib/types';

export interface GuestChatState {
  /** Full ordered message history (user + bot alternating) */
  messages: Message[];
  /** How many bot responses have been received (max = GUEST_MESSAGE_LIMIT) */
  botResponseCount: number;

  // Actions
  addMessage: (msg: Message) => void;
  incrementBotCount: () => void;
  clearGuestChat: () => void;
}

export const useGuestChatStore = create<GuestChatState>()(
  persist(
    (set) => ({
      messages: [],
      botResponseCount: 0,

      addMessage: (msg: Message) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      incrementBotCount: () =>
        set((state) => ({ botResponseCount: state.botResponseCount + 1 })),

      clearGuestChat: () =>
        set({ messages: [], botResponseCount: 0 }),
    }),
    {
      name: 'cognilex-guest-chat', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Serialize Date objects so they round-trip correctly
      partialize: (state) => ({
        messages: state.messages.map((m) => ({
          ...m,
          timestamp: m.timestamp instanceof Date
            ? m.timestamp.toISOString()
            : m.timestamp,
        })),
        botResponseCount: state.botResponseCount,
      }),
    }
  )
);

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { authClient, buildAuthHeaders } from '../lib/authClient'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'

const guestState = {
  user: null,
  accessToken: null,
  authStatus: 'guest',
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...guestState,
      isSubmitting: false,
      authError: null,
      hasBootstrapped: false,
      clearAuthError: () => set({ authError: null }),
      bootstrapAuth: async () => {
        if (get().hasBootstrapped || get().authStatus === 'checking') {
          return
        }

        set({ authStatus: 'checking', authError: null })

        const existingToken = get().accessToken

        if (existingToken) {
          try {
            const response = await authClient.get('/auth/me', {
              headers: buildAuthHeaders(existingToken),
            })

            set({
              user: response.data.user,
              authStatus: 'authenticated',
              hasBootstrapped: true,
            })

            return
          } catch {
            set({ accessToken: null, user: null })
          }
        }

        try {
          const refreshed = await authClient.post('/auth/refresh')

          set({
            user: refreshed.data.user,
            accessToken: refreshed.data.accessToken,
            authStatus: 'authenticated',
            authError: null,
            hasBootstrapped: true,
          })
        } catch {
          set({
            ...guestState,
            authError: null,
            hasBootstrapped: true,
          })
        }
      },
      login: async (credentials) => {
        set({ isSubmitting: true, authError: null })

        try {
          const response = await authClient.post('/auth/login', credentials)

          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            authStatus: 'authenticated',
            isSubmitting: false,
            authError: null,
            hasBootstrapped: true,
          })

          return response.data.user
        } catch (error) {
          set({
            ...guestState,
            isSubmitting: false,
            authError: getApiErrorMessage(error, 'Unable to sign in'),
            hasBootstrapped: true,
          })

          throw error
        }
      },
      register: async (payload) => {
        set({ isSubmitting: true, authError: null })

        try {
          const response = await authClient.post('/auth/register', payload)

          set({
            user: response.data.user,
            accessToken: response.data.accessToken,
            authStatus: 'authenticated',
            isSubmitting: false,
            authError: null,
            hasBootstrapped: true,
          })

          return response.data.user
        } catch (error) {
          set({
            ...guestState,
            isSubmitting: false,
            authError: getApiErrorMessage(error, 'Unable to create your account'),
            hasBootstrapped: true,
          })

          throw error
        }
      },
      logout: async () => {
        set({ isSubmitting: true, authError: null })

        try {
          await authClient.post('/auth/logout')
        } finally {
          set({
            ...guestState,
            isSubmitting: false,
            hasBootstrapped: true,
          })
        }
      },
    }),
    {
      name: 'gigyaatra-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
)

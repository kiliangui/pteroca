"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from "react"
export function Providers({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    posthog.init("phc_VJOzV355CaQ8DQC7sqg6rKLtaWkCXX9E0FrkzbRdetw" as string, {
      api_host:  'https://eu.i.posthog.com',
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      defaults: '2025-05-24'
    })
  }, [])

  return (
    <PHProvider client={posthog}>
    <SessionProvider>
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          {children}
        </ThemeProvider>
    </SessionProvider>
      </PHProvider>
  )
}

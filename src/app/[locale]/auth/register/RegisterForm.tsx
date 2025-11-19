"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGameShowcase, showcaseGames } from "@/components/auth/GameShowcase"

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const t = useTranslations("auth")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeGameIndex, setActiveGameIndex] = useState(0)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGameIndex((current) => (current + 1) % showcaseGames.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const activeGame = showcaseGames[activeGameIndex]

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
        }),
      })

      if (response.ok) {
        router.push("/auth/login")
        return
      }

      const errorData = await response.json()
      setError(errorData.message || "Registration failed")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex-1">
          <AuthGameShowcase
            badgeLabel={t("register.showcaseLabel")}
            game={activeGame}
            className="h-full min-h-[640px] rounded-none"
            noBorder
          />
        </div>

        <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 p-6">
          <div className="w-full max-w-xl space-y-8 rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-[0_35px_80px_rgba(2,6,23,0.85)] sm:p-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{t("register.eyebrow")}</p>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">{t("register.title")}</h1>
              <p className="text-base text-slate-300">{t("register.description")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-200">
                    {t("register.firstNameLabel")}
                  </Label>
                  <Input
                    id="name"
                    placeholder={t("register.firstNamePlaceholder")}
                    {...register("name")}
                    className="bg-white/5 text-white"
                  />
                  {errors.name && (
                    <p className="text-sm text-rose-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname" className="text-sm font-semibold text-slate-200">
                    {t("register.lastNameLabel")}
                  </Label>
                  <Input
                    id="surname"
                    placeholder={t("register.lastNamePlaceholder")}
                    {...register("surname")}
                    className="bg-white/5 text-white"
                  />
                  {errors.surname && (
                    <p className="text-sm text-rose-400">{errors.surname.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-200">
                  {t("register.emailLabel")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("register.emailPlaceholder")}
                  {...register("email")}
                  className="bg-white/5 text-white"
                />
                {errors.email && (
                  <p className="text-sm text-rose-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-200">
                  {t("register.passwordLabel")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("register.passwordPlaceholder")}
                  {...register("password")}
                  className="bg-white/5 text-white"
                />
                {errors.password && (
                  <p className="text-sm text-rose-400">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-200">
                  {t("register.confirmPasswordLabel")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t("register.confirmPasswordPlaceholder")}
                  {...register("confirmPassword")}
                  className="bg-white/5 text-white"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-rose-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <p className="text-center text-sm text-rose-500">{error}</p>
              )}

              <Button size="lg" className="w-full font-semibold" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : t("register.signUp")}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.5em] text-slate-400">
                <span className="bg-slate-950 px-3">{t("common.orContinue")}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-white/30 text-white"
              onClick={() => signIn("discord", { callbackUrl: "/dashboard/servers" })}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              {t("common.discord")}
            </Button>
{/*
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/30 text-white"
              onClick={() => signIn("google", { callbackUrl: "/dashboard/servers" })}
            >
              <svg width="800px" height="800px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="currentColor"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="currentColor"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="currentColor"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="currentColor"/></svg>
              {t("common.google")}
            </Button>*/}

            <p className="text-center text-sm text-slate-400">
              {t("register.cta")}{" "}
              <Link href="/auth/login" className="font-semibold text-white underline-offset-4 hover:underline">
                {t("register.ctaAction")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

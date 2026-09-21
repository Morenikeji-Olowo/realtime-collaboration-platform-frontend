import * as React from "react"
import { MailIcon, PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useLocation, useParams, Link } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login-schema"
import { login } from "@/features/auth/api/auth-api"
import { ApiError } from "@/lib/api/client"
import { Title, P, Muted } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDocuments } from "@/features/documents/hooks/use-documents"
import { DocumentList } from "@/features/documents/components/document-list"
import { CreateDocumentDialog } from "@/features/documents/components/create-document-dialog"

const make = (name: string) => () => <div className="p-8">{name}</div>

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/"

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(from, { replace: true }),
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Try again."
      setError("root", { message })
    },
  })

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="w-full max-w-sm space-y-4"
      >
        <Title className="text-2xl">Log in</Title>

        <div className="space-y-1">
          <Input placeholder="Email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Input placeholder="Password" type="password" {...register("password")} />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Logging in..." : "Log in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/forgot-password" className="underline underline-offset-4">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  )
}

export function Verify() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <MailIcon className="size-10 text-muted-foreground" />
      <Title className="text-2xl">Check your email</Title>
      <P className="max-w-sm text-muted-foreground">
        We've sent a confirmation link to your email address. Click it to activate your account, then log in.
      </P>
      {/* TODO: wire to a real resend endpoint once one exists (Supabase's own resend() method, or a backend relay matching the signup/login pattern) */}
      <Button variant="outline">Resend email</Button>
      <Muted>
        <a href="/login" className="underline underline-offset-4">Back to login</a>
      </Muted>
    </div>
  )
}

export function Documents() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: documents, isLoading } = useDocuments(workspaceId!)
  const [createOpen, setCreateOpen] = React.useState(false)

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Title className="text-2xl">Documents</Title>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusIcon />
          New document
        </Button>
      </div>
      <DocumentList documents={documents} workspaceId={workspaceId!} isLoading={isLoading} />
      <CreateDocumentDialog
        workspaceId={workspaceId!}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  )
}

export const ForgotPassword = make("Forgot Password")
export const ResetPassword = make("Reset Password")
export const Onboarding = make("Onboarding")
export const WorkspaceSelector = make("Workspace Selector")
export const Home = make("Home")
export const DocumentEditor = make("Document Editor")
export const Whiteboard = make("Whiteboard")
export const Chat = make("Chat")
export const Activity = make("Activity")
export const Members = make("Members")
export const WorkspaceSettings = make("Workspace Settings")
export const ProfileSettings = make("Profile Settings")
export const NotFound = make("404 — Not Found")
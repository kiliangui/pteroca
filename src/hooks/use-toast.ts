import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

function useToast() {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
      })
    }

    return sonnerToast.success(title, {
      description,
    })
  }

  return {
    toast,
  }
}

export { useToast }
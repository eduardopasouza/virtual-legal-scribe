
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, ToasterProps as SonnerToasterProps } from "sonner"
import { X } from "lucide-react"

type ToasterProps = SonnerToasterProps & {
  closeButton?: boolean;
}

const Toaster = ({ closeButton = true, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      closeButton={closeButton}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:bg-transparent group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-muted"
        },
        duration: 5000,
      }}
      {...props}
    />
  )
}

export { Toaster, toast }

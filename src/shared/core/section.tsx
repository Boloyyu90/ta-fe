import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const sectionVariants = cva(
  "relative w-full overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-background",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        muted: "bg-muted/30",
        gradient: "bg-gradient-to-br from-primary/5 via-secondary/5 to-background",
        glass: "bg-background/50 backdrop-blur-xl border border-border/50",
        transparent: "bg-transparent",
      },
      padding: {
        none: "",
        sm: "py-8 md:py-12",
        default: "py-12 md:py-16 lg:py-20",
        lg: "py-16 md:py-20 lg:py-24",
        xl: "py-20 md:py-24 lg:py-32",
      },
      container: {
        none: "",
        default: "container mx-auto px-4 sm:px-6 lg:px-8",
        narrow: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl",
        wide: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",
        full: "px-4 sm:px-6 lg:px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      container: "default",
    },
  }
);

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: "section" | "div" | "article";
  children: React.ReactNode;
}

const Section = ({
  className,
  variant,
  padding,
  container,
  as = "section",
  children,
  ...props
}: SectionProps) => {
  const Component = as;

  return (
    <Component
      className={cn(sectionVariants({ variant, padding }), className)}
      {...props}
    >
      <div className={cn(sectionVariants({ container, padding: 'none' }))}>
        {children}
      </div>
    </Component>
  );
};

Section.displayName = "Section";

export { Section, sectionVariants };

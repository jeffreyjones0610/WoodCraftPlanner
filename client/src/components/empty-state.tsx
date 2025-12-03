import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Hammer, Ruler, Plus, Drill } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
}

export function EmptyState({ 
  title = "No projects yet",
  description = "Start your first woodworking project and keep track of cut lists, materials, and costs.",
  showCreateButton = true 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center">
          <div className="relative">
            <Hammer className="h-12 w-12 text-muted-foreground/60 absolute -top-2 -left-6 -rotate-45" />
            <Ruler className="h-10 w-10 text-muted-foreground/40 absolute top-4 left-4 rotate-12" />
            <Drill className="h-8 w-8 text-muted-foreground/30 absolute -bottom-2 right-0 rotate-45" />
          </div>
        </div>
      </div>
      
      <h3 className="font-serif text-2xl font-semibold mb-2" data-testid="text-empty-title">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6" data-testid="text-empty-description">
        {description}
      </p>
      
      {showCreateButton && (
        <Link href="/projects/new">
          <Button size="lg" className="gap-2" data-testid="button-create-first-project">
            <Plus className="h-5 w-5" />
            Create Your First Project
          </Button>
        </Link>
      )}
    </div>
  );
}

import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  type Project, 
  calculateProjectCost, 
  calculateProjectBoardFeet,
  getTotalPieces 
} from "@shared/schema";
import { Eye, Edit, Trash2, Ruler, DollarSign, Layers } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const totalCost = calculateProjectCost(project.cutList);
  const totalBoardFeet = calculateProjectBoardFeet(project.cutList);
  const totalPieces = getTotalPieces(project.cutList);

  return (
    <Card className="group flex flex-col h-full hover-elevate" data-testid={`card-project-${project.id}`}>
      <div className="aspect-video relative overflow-hidden rounded-t-md bg-muted">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent">
            <Layers className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-serif text-xl font-semibold line-clamp-1" data-testid={`text-project-title-${project.id}`}>
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            <Layers className="h-3 w-3" />
            <span data-testid={`text-pieces-${project.id}`}>{totalPieces} pieces</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Ruler className="h-3 w-3" />
            <span data-testid={`text-boardfeet-${project.id}`}>{totalBoardFeet.toFixed(1)} bd ft</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <DollarSign className="h-3 w-3" />
            <span data-testid={`text-cost-${project.id}`}>${totalCost.toFixed(2)}</span>
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Link href={`/projects/${project.id}`} className="flex-1">
          <Button variant="outline" className="w-full" data-testid={`button-view-${project.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/edit`}>
          <Button variant="ghost" size="icon" data-testid={`button-edit-${project.id}`}>
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(project.id)}
            data-testid={`button-delete-${project.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

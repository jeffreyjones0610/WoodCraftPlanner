import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SEO } from "@/components/seo";
import { projectTemplates, type ProjectTemplate } from "@shared/project-templates";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Clock,
  Layers,
  DollarSign,
  ArrowRight,
  Loader2,
  Hammer,
  Armchair,
  TreeDeciduous,
  Package,
  Frame,
  Home,
} from "lucide-react";

const categoryIcons = {
  furniture: Armchair,
  storage: Package,
  outdoor: TreeDeciduous,
  workshop: Hammer,
  decor: Frame,
};

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function Templates() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [projectTitle, setProjectTitle] = useState("");

  const createFromTemplateMutation = useMutation({
    mutationFn: async ({ template, title }: { template: ProjectTemplate; title: string }) => {
      const response = await apiRequest("POST", "/api/projects", {
        title: title || template.name,
        description: template.description,
        imageUrl: template.imageUrl || "",
        cutList: template.cutList,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: "Your new project has been created from the template.",
      });
      setSelectedTemplate(null);
      navigate(`/projects/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredTemplates = projectTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "all" || template.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const calculateTemplateCost = (template: ProjectTemplate) => {
    return template.cutList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  };

  const getTotalPieces = (template: ProjectTemplate) => {
    return template.cutList.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleUseTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setProjectTitle(template.name);
  };

  const handleCreateProject = () => {
    if (selectedTemplate) {
      createFromTemplateMutation.mutate({ template: selectedTemplate, title: projectTitle });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Project Templates"
        description="Browse our library of woodworking project templates. From beginner furniture to advanced outdoor builds, find the perfect starting point for your next DIY project."
        url="/templates"
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-home">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <section className="mb-8" aria-label="Templates header">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2" data-testid="text-templates-title">
            Project Templates
          </h1>
          <p className="text-muted-foreground text-lg">
            Start your next woodworking project with a pre-built template
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-templates"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="decor">Decor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-difficulty">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">No templates found</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setDifficultyFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const CategoryIcon = categoryIcons[template.category];
              return (
                <Card key={template.id} className="flex flex-col" data-testid={`card-template-${template.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-primary/10">
                          <CategoryIcon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <Badge className={difficultyColors[template.difficulty]}>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{template.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{getTotalPieces(template)} pcs</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3.5 w-3.5" />
                        <span>${calculateTemplateCost(template).toFixed(0)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      className="w-full gap-2"
                      onClick={() => handleUseTemplate(template)}
                      data-testid={`button-use-template-${template.id}`}
                    >
                      Use Template
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project from Template</DialogTitle>
              <DialogDescription>
                This will create a new project using the "{selectedTemplate?.name}" template.
                You can customize the project title below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                data-testid="input-project-title"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
                disabled={createFromTemplateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={createFromTemplateMutation.isPending}
                className="gap-2"
                data-testid="button-create-from-template"
              >
                {createFromTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Project
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

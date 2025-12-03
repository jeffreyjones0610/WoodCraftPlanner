import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";
import { DeleteDialog } from "@/components/delete-dialog";
import { ProjectGallerySkeleton } from "@/components/loading-skeleton";
import { type Project, materialTypes } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, SortAsc, Filter } from "lucide-react";

type SortOption = "newest" | "oldest" | "cost-high" | "cost-low" | "name";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterMaterial, setFilterMaterial] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been permanently removed.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = projects
    ?.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMaterial =
        filterMaterial === "all" ||
        project.cutList.some((item) => item.material === filterMaterial);

      return matchesSearch && matchesMaterial;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "cost-high":
          const costA = a.cutList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
          const costB = b.cutList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
          return costB - costA;
        case "cost-low":
          const costA2 = a.cutList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
          const costB2 = b.cutList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
          return costA2 - costB2;
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-projects-title">
              Your Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize all your woodworking projects
            </p>
          </div>
          <Link href="/projects/new">
            <Button className="gap-2" data-testid="button-new-project-page">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterMaterial} onValueChange={setFilterMaterial}>
              <SelectTrigger className="w-[160px]" data-testid="select-filter-material">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Materials</SelectItem>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[150px]" data-testid="select-sort">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="cost-high">Highest Cost</SelectItem>
                <SelectItem value="cost-low">Lowest Cost</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <ProjectGallerySkeleton />
        ) : !filteredProjects || filteredProjects.length === 0 ? (
          searchQuery || filterMaterial !== "all" ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4" data-testid="text-no-results">
                No projects found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterMaterial("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}

        <DeleteDialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { MetricCard } from "@/components/metric-card";
import { EmptyState } from "@/components/empty-state";
import { ProjectGallerySkeleton, MetricsSkeleton } from "@/components/loading-skeleton";
import { HomeSEO } from "@/components/seo";
import { 
  type Project, 
  calculateProjectCost, 
  calculateProjectBoardFeet,
  getTotalPieces 
} from "@shared/schema";
import { FolderOpen, Ruler, DollarSign, Layers, Plus, ArrowRight } from "lucide-react";

export default function Home() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const totalProjects = projects?.length ?? 0;
  const totalBoardFeet = projects?.reduce(
    (sum, p) => sum + calculateProjectBoardFeet(p.cutList),
    0
  ) ?? 0;
  const totalCost = projects?.reduce(
    (sum, p) => sum + calculateProjectCost(p.cutList),
    0
  ) ?? 0;
  const totalPieces = projects?.reduce(
    (sum, p) => sum + getTotalPieces(p.cutList),
    0
  ) ?? 0;

  const recentProjects = projects?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen">
      <HomeSEO />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/20 to-background py-16 sm:py-24" aria-label="Hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMGMtNC40MTggMC04LTMuNTgyLTgtOHMzLjU4Mi04IDgtOCA4IDMuNTgyIDggOC0zLjU4MiA4LTggOHoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIuMDMiLz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" data-testid="text-hero-title">
              Craft Your Vision,{" "}
              <span className="text-primary">Plan Every Cut</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              Organize your DIY woodworking projects with detailed cut lists, 
              material tracking, and cost estimates. From blueprint to finished piece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects/new">
                <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-hero-new-project">
                  <Plus className="h-5 w-5" />
                  Start New Project
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto backdrop-blur-sm" data-testid="button-hero-view-projects">
                  View All Projects
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-6" data-testid="text-metrics-title">
            Workshop Overview
          </h2>
          {isLoading ? (
            <MetricsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="Total Projects"
                value={totalProjects}
                icon={FolderOpen}
                testId="metric-projects"
              />
              <MetricCard
                title="Total Board Feet"
                value={totalBoardFeet.toFixed(1)}
                icon={Ruler}
                description="Estimated lumber"
                testId="metric-boardfeet"
              />
              <MetricCard
                title="Total Cost"
                value={`$${totalCost.toFixed(2)}`}
                icon={DollarSign}
                description="Materials estimate"
                testId="metric-cost"
              />
              <MetricCard
                title="Total Pieces"
                value={totalPieces}
                icon={Layers}
                description="Across all projects"
                testId="metric-pieces"
              />
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h2 className="font-serif text-2xl font-semibold" data-testid="text-recent-title">
              Recent Projects
            </h2>
            {totalProjects > 0 && (
              <Link href="/projects">
                <Button variant="ghost" className="gap-2" data-testid="link-view-all">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <ProjectGallerySkeleton count={3} />
          ) : recentProjects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

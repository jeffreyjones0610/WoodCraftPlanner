import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CutListTable } from "@/components/cut-list-table";
import { HardwareTable } from "@/components/hardware-table";
import { ProjectNotes } from "@/components/project-notes";
import { DeleteDialog } from "@/components/delete-dialog";
import { ProjectDetailSkeleton } from "@/components/loading-skeleton";
import { OptimizationCalculator } from "@/components/optimization-calculator";
import { ShoppingListExport } from "@/components/shopping-list-export";
import { ProjectSEO, SEO } from "@/components/seo";
import {
  type ProjectWithDetails,
  type CutListItemForm,
  type HardwareItemForm,
  calculateProjectCost,
  calculateProjectBoardFeet,
  calculateHardwareCost,
  getTotalPieces,
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Layers,
  Ruler,
  DollarSign,
  Calendar,
  Printer,
  Copy,
  Wrench,
  Loader2,
  FileDown,
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const { data: project, isLoading, error } = useQuery<ProjectWithDetails>({
    queryKey: ["/api/projects", id],
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been permanently removed.",
      });
      navigate("/projects");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${id}/clone`);
      return response.json();
    },
    onSuccess: (data: ProjectWithDetails) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project cloned",
        description: "A copy of this project has been created.",
      });
      navigate(`/projects/${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clone project. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProjectDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-16">
          <h2 className="font-serif text-2xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cutListForms: CutListItemForm[] = project.cutList.map(item => ({
    id: item.id,
    partName: item.partName,
    quantity: item.quantity,
    length: typeof item.length === 'string' ? parseFloat(item.length) : item.length,
    width: typeof item.width === 'string' ? parseFloat(item.width) : item.width,
    thickness: typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness,
    material: item.material as any,
    unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
    notes: item.notes || undefined,
    status: (item.status as any) || "not_started",
  }));

  const hardwareForms: HardwareItemForm[] = (project.hardware || []).map(item => ({
    id: item.id,
    name: item.name,
    type: item.type as any,
    size: item.size || undefined,
    quantity: item.quantity,
    unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
    notes: item.notes || undefined,
    url: item.url || undefined,
  }));

  const totalCost = calculateProjectCost(cutListForms);
  const hardwareCost = calculateHardwareCost(hardwareForms);
  const totalBoardFeet = calculateProjectBoardFeet(cutListForms);
  const totalPieces = getTotalPieces(cutListForms);
  const totalHardwarePieces = hardwareForms.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = totalCost + hardwareCost;

  const materialBreakdown = cutListForms.reduce((acc, item) => {
    const existing = acc.find((m) => m.material === item.material);
    if (existing) {
      existing.pieces += item.quantity;
      existing.cost += item.unitPrice * item.quantity;
    } else {
      acc.push({
        material: item.material,
        pieces: item.quantity,
        cost: item.unitPrice * item.quantity,
      });
    }
    return acc;
  }, [] as { material: string; pieces: number; cost: number }[]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
    toast({
      title: "Print dialog opened",
      description: "Select 'Save as PDF' to export your project plan.",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 print:py-4 print:px-2">
      <ProjectSEO project={project} />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 print:hidden flex-wrap">
          <Link href="/projects">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex gap-2 flex-wrap">
            <ShoppingListExport project={{ ...project, cutList: cutListForms, hardware: hardwareForms }} />
            <Button 
              variant="outline" 
              onClick={() => cloneMutation.mutate()} 
              className="gap-2"
              disabled={cloneMutation.isPending}
              data-testid="button-clone"
            >
              {cloneMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Clone
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="gap-2" data-testid="button-export-pdf">
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={handlePrint} className="gap-2" data-testid="button-print">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Link href={`/projects/${id}/edit`}>
              <Button variant="outline" className="gap-2" data-testid="button-edit">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2 text-destructive hover:text-destructive"
              data-testid="button-delete"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {project.imageUrl && (
          <div className="aspect-[21/9] w-full rounded-md overflow-hidden bg-muted mb-8">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2" data-testid="text-project-title">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-muted-foreground text-lg" data-testid="text-project-description">
                  {project.description}
                </p>
              )}
            </div>

            <Separator />

            <Tabs defaultValue="cutlist" className="print:hidden">
              <TabsList>
                <TabsTrigger value="cutlist" className="gap-2" data-testid="tab-cutlist">
                  <Layers className="h-4 w-4" />
                  Cut List ({cutListForms.length})
                </TabsTrigger>
                <TabsTrigger value="hardware" className="gap-2" data-testid="tab-hardware">
                  <Wrench className="h-4 w-4" />
                  Hardware ({hardwareForms.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cutlist" className="mt-4">
                <CutListTable items={cutListForms} onChange={() => {}} readOnly />
              </TabsContent>
              <TabsContent value="hardware" className="mt-4">
                <HardwareTable items={hardwareForms} onChange={() => {}} readOnly />
              </TabsContent>
            </Tabs>

            <div className="print:block hidden">
              <h2 className="font-semibold text-xl mb-4">Cut List</h2>
              <CutListTable items={cutListForms} onChange={() => {}} readOnly />
              
              {hardwareForms.length > 0 && (
                <>
                  <h2 className="font-semibold text-xl mb-4 mt-8">Hardware & Fasteners</h2>
                  <HardwareTable items={hardwareForms} onChange={() => {}} readOnly />
                </>
              )}
            </div>

            <div className="print:hidden">
              <Separator className="my-6" />
              <ProjectNotes projectId={project.id} />
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers className="h-4 w-4" />
                    <span>Cut List Pieces</span>
                  </div>
                  <span className="font-semibold" data-testid="text-summary-pieces">{totalPieces}</span>
                </div>
                {totalHardwarePieces > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wrench className="h-4 w-4" />
                      <span>Hardware Items</span>
                    </div>
                    <span className="font-semibold" data-testid="text-summary-hardware">{totalHardwarePieces}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ruler className="h-4 w-4" />
                    <span>Board Feet</span>
                  </div>
                  <span className="font-semibold" data-testid="text-summary-boardfeet">{totalBoardFeet.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Lumber Cost</span>
                  </div>
                  <span className="font-semibold" data-testid="text-summary-lumber-cost">${totalCost.toFixed(2)}</span>
                </div>
                {hardwareCost > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wrench className="h-4 w-4" />
                      <span>Hardware Cost</span>
                    </div>
                    <span className="font-semibold" data-testid="text-summary-hardware-cost">${hardwareCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <DollarSign className="h-4 w-4" />
                    <span>Total Estimated Cost</span>
                  </div>
                  <span className="font-bold text-lg" data-testid="text-summary-cost">${grandTotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created</span>
                  </div>
                  <span data-testid="text-summary-created">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {materialBreakdown.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Material Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {materialBreakdown.map((item) => (
                      <div
                        key={item.material}
                        className="flex items-center justify-between"
                        data-testid={`material-${item.material.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{item.material}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.pieces} piece{item.pieces !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <span className="font-medium">${item.cost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <OptimizationCalculator cutList={cutListForms} />
          </div>
        </div>

        <DeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => deleteMutation.mutate()}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </div>
  );
}

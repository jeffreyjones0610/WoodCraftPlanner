import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CutListTable } from "@/components/cut-list-table";
import { ImageUpload } from "@/components/image-upload";
import { ProjectDetailSkeleton } from "@/components/loading-skeleton";
import {
  type Project,
  type CutListItem,
  type InsertProject,
  insertProjectSchema,
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id;

  const [cutList, setCutList] = useState<CutListItem[]>([]);

  const { data: project, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: isEditing,
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description ?? "",
        imageUrl: project.imageUrl ?? "",
      });
      setCutList(project.cutList);
    }
  }, [project, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("POST", "/api/projects", {
        ...data,
        cutList: cutList.map((item) => ({
          partName: item.partName,
          quantity: item.quantity,
          length: item.length,
          width: item.width,
          thickness: item.thickness,
          material: item.material,
          unitPrice: item.unitPrice,
          notes: item.notes,
        })),
      });
      return response.json();
    },
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: "Your new project has been saved successfully.",
      });
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

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const response = await apiRequest("PATCH", `/api/projects/${id}`, {
        ...data,
        cutList: cutList.map((item) => ({
          partName: item.partName,
          quantity: item.quantity,
          length: item.length,
          width: item.width,
          thickness: item.thickness,
          material: item.material,
          unitPrice: item.unitPrice,
          notes: item.notes,
        })),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({
        title: "Project updated",
        description: "Your changes have been saved successfully.",
      });
      navigate(`/projects/${id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingProject) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ProjectDetailSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={isEditing ? `/projects/${id}` : "/projects"}>
            <Button variant="ghost" className="gap-2" data-testid="button-back-form">
              <ArrowLeft className="h-4 w-4" />
              {isEditing ? "Back to Project" : "Back to Projects"}
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight" data-testid="text-form-title">
            {isEditing ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing
              ? "Update your project details and cut list"
              : "Add your project details and build your cut list"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Farmhouse Dining Table"
                          {...field}
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project, materials, and any special notes..."
                          className="min-h-[100px] resize-y"
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add details about your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Project Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cut List</CardTitle>
              </CardHeader>
              <CardContent>
                <CutListTable items={cutList} onChange={setCutList} />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 sticky bottom-4 bg-background/95 backdrop-blur p-4 -mx-4 border-t">
              <Link href={isEditing ? `/projects/${id}` : "/projects"}>
                <Button type="button" variant="outline" data-testid="button-cancel">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending} className="gap-2" data-testid="button-save">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditing ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditing ? "Save Changes" : "Create Project"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

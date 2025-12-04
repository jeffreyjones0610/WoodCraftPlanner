import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/image-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Plus, Trash2, Image, MessageSquare, Loader2 } from "lucide-react";
import type { ProjectNote } from "@shared/schema";

interface ProjectNotesProps {
  projectId: string;
}

export function ProjectNotes({ projectId }: ProjectNotesProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const { data: notes, isLoading } = useQuery<ProjectNote[]>({
    queryKey: ["/api/projects", projectId, "notes"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/notes`);
      if (!response.ok) throw new Error("Failed to fetch notes");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { content: string; imageUrl?: string }) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/notes`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setNewContent("");
      setNewImageUrl("");
      setIsAdding(false);
      toast({
        title: "Note added",
        description: "Your build note has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await apiRequest("DELETE", `/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!newContent.trim()) return;
    createMutation.mutate({
      content: newContent.trim(),
      imageUrl: newImageUrl || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Build Notes
        </h3>
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-2"
            data-testid="button-add-note"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>

      {isAdding && (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <Textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your build notes here..."
              className="min-h-[100px] resize-y"
              data-testid="input-note-content"
            />
            
            <ImageUpload
              value={newImageUrl}
              onChange={setNewImageUrl}
              label="Add Photo (optional)"
            />
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewContent("");
                  setNewImageUrl("");
                }}
                data-testid="button-cancel-note"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!newContent.trim() || createMutation.isPending}
                className="gap-2"
                data-testid="button-save-note"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Note"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {notes && notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} data-testid={`card-note-${note.id}`}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-2">
                      {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                    {note.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={note.imageUrl}
                          alt="Build photo"
                          className="rounded-md max-h-64 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => deleteMutation.mutate(note.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-note-${note.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No build notes yet</p>
            <p className="text-sm">Document your progress with notes and photos</p>
          </div>
        )
      )}
    </div>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { UnitProvider } from "@/components/unit-toggle";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import ProjectForm from "@/pages/project-form";
import Templates from "@/pages/templates";
import Inventory from "@/pages/inventory";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/new" component={ProjectForm} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/projects/:id/edit" component={ProjectForm} />
      <Route path="/templates" component={Templates} />
      <Route path="/inventory" component={Inventory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="woodcraft-theme">
        <UnitProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                <Router />
              </main>
            </div>
            <Toaster />
          </TooltipProvider>
        </UnitProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

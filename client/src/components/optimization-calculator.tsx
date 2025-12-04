import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { type CutListItemForm } from "@shared/schema";
import { optimizeCutList, calculateWasteBoardFeet } from "@shared/cut-optimizer";
import { 
  Lightbulb, 
  Package, 
  DollarSign, 
  Percent, 
  Layers, 
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface OptimizationCalculatorProps {
  cutList: CutListItemForm[];
}

export function OptimizationCalculator({ cutList }: OptimizationCalculatorProps) {
  const result = useMemo(() => optimizeCutList(cutList), [cutList]);
  const wasteBoardFeet = useMemo(() => calculateWasteBoardFeet(result), [result]);
  
  if (cutList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Material Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Add items to your cut list to see optimization recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const efficiencyColor = result.wastePercentage < 15 
    ? "text-green-600" 
    : result.wastePercentage < 30 
    ? "text-yellow-600" 
    : "text-red-600";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Material Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Package className="h-4 w-4" />
              Boards Needed
            </p>
            <p className="text-2xl font-bold" data-testid="text-boards-needed">
              {result.totalBoards}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Estimated Cost
            </p>
            <p className="text-2xl font-bold" data-testid="text-estimated-cost">
              ${result.estimatedCost.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Percent className="h-4 w-4" />
              Material Efficiency
            </span>
            <span className={`font-semibold ${efficiencyColor}`}>
              {(100 - result.wastePercentage).toFixed(1)}%
            </span>
          </div>
          <Progress value={100 - result.wastePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            ~{wasteBoardFeet.toFixed(2)} board feet of waste
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Board Breakdown
          </h4>
          {result.boardUsage.map((usage, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md bg-muted/50 space-y-2"
              data-testid={`board-usage-${index}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{usage.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {usage.boardsNeeded} board{usage.boardsNeeded !== 1 ? "s" : ""} × ${usage.product.price.toFixed(2)}
                  </p>
                </div>
                <Badge 
                  variant={usage.wastePercentage < 20 ? "secondary" : "destructive"}
                  className="shrink-0"
                >
                  {usage.wastePercentage.toFixed(0)}% waste
                </Badge>
              </div>
              {usage.product.homeDepotUrl && (
                <a
                  href={usage.product.homeDepotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View at Home Depot
                </a>
              )}
            </div>
          ))}
        </div>
        
        {result.suggestions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                {result.wastePercentage < 20 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
                Suggestions
              </h4>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

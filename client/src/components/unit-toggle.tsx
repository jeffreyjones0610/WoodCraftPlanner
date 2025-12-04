import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

interface UnitContextType {
  useMetric: boolean;
  toggleUnits: () => void;
  formatLength: (inches: number) => string;
  formatDimensions: (length: number, width: number, thickness: number) => string;
}

const UnitContext = createContext<UnitContextType | null>(null);

const INCHES_TO_CM = 2.54;

export function UnitProvider({ children }: { children: React.ReactNode }) {
  const [useMetric, setUseMetric] = useState(() => {
    const saved = localStorage.getItem("woodcraft-use-metric");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("woodcraft-use-metric", String(useMetric));
  }, [useMetric]);

  const toggleUnits = () => setUseMetric(!useMetric);

  const formatLength = (inches: number): string => {
    if (useMetric) {
      const cm = inches * INCHES_TO_CM;
      return `${cm.toFixed(1)} cm`;
    }
    return `${inches.toFixed(2)}"`;
  };

  const formatDimensions = (length: number, width: number, thickness: number): string => {
    if (useMetric) {
      const l = (length * INCHES_TO_CM).toFixed(1);
      const w = (width * INCHES_TO_CM).toFixed(1);
      const t = (thickness * INCHES_TO_CM).toFixed(1);
      return `${l} × ${w} × ${t} cm`;
    }
    return `${length}" × ${width}" × ${thickness}"`;
  };

  return (
    <UnitContext.Provider value={{ useMetric, toggleUnits, formatLength, formatDimensions }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnits must be used within a UnitProvider");
  }
  return context;
}

export function UnitToggle() {
  const { useMetric, toggleUnits } = useUnits();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleUnits}
      className="gap-2"
      data-testid="button-unit-toggle"
    >
      <Ruler className="h-4 w-4" />
      {useMetric ? "Metric" : "Imperial"}
    </Button>
  );
}

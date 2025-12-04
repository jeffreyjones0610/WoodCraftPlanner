// Cut Optimization Algorithm
// Uses a first-fit decreasing algorithm to minimize waste

import { type CutListItemForm } from "./schema";
import { type MaterialProduct, getProductsByMaterial, getAllProducts } from "./materials-database";

export interface CutPiece {
  partName: string;
  length: number;
  width: number;
  thickness: number;
  quantity: number;
}

export interface BoardUsage {
  product: MaterialProduct;
  pieces: CutPiece[];
  usedLength: number;
  wastePercentage: number;
  boardsNeeded: number;
}

export interface OptimizationResult {
  boardUsage: BoardUsage[];
  totalWaste: number;
  wastePercentage: number;
  totalBoards: number;
  estimatedCost: number;
  suggestions: string[];
}

// Standard lumber lengths in inches
const STANDARD_LENGTHS = [48, 72, 96, 120, 144, 192]; // 4', 6', 8', 10', 12', 16'

// Find the best matching standard board for a set of cuts
function findBestBoard(
  cuts: CutPiece[],
  material: string,
  targetThickness: number
): MaterialProduct | null {
  const products = getProductsByMaterial(material);
  
  // Filter products that match the thickness requirement
  const matchingProducts = products.filter(p => 
    p.dimensions.thickness >= targetThickness
  );
  
  if (matchingProducts.length === 0) {
    // Fall back to any product of this material
    return products[0] || null;
  }
  
  // Get the maximum required length and width
  const maxLength = Math.max(...cuts.map(c => c.length));
  const maxWidth = Math.max(...cuts.map(c => c.width));
  
  // Find smallest board that can accommodate the largest cut
  const validBoards = matchingProducts.filter(p =>
    p.dimensions.length >= maxLength &&
    p.dimensions.width >= maxWidth
  );
  
  if (validBoards.length === 0) return matchingProducts[0];
  
  // Sort by price to get the most economical option
  validBoards.sort((a, b) => a.price - b.price);
  
  return validBoards[0];
}

// First-Fit Decreasing bin packing algorithm for linear cuts
function optimizeLinearCuts(
  pieces: CutPiece[],
  boardLength: number
): { bins: CutPiece[][], totalWaste: number } {
  // Expand pieces by quantity and sort by length (decreasing)
  const expandedPieces: CutPiece[] = [];
  for (const piece of pieces) {
    for (let i = 0; i < piece.quantity; i++) {
      expandedPieces.push({ ...piece, quantity: 1 });
    }
  }
  
  expandedPieces.sort((a, b) => b.length - a.length);
  
  const bins: CutPiece[][] = [];
  const binRemaining: number[] = [];
  
  for (const piece of expandedPieces) {
    // Add kerf allowance (1/8" for saw blade)
    const pieceWithKerf = piece.length + 0.125;
    
    // Find first bin with enough space
    let placed = false;
    for (let i = 0; i < bins.length; i++) {
      if (binRemaining[i] >= pieceWithKerf) {
        bins[i].push(piece);
        binRemaining[i] -= pieceWithKerf;
        placed = true;
        break;
      }
    }
    
    // Create new bin if piece doesn't fit
    if (!placed) {
      bins.push([piece]);
      binRemaining.push(boardLength - pieceWithKerf);
    }
  }
  
  const totalWaste = binRemaining.reduce((sum, remaining) => sum + remaining, 0);
  
  return { bins, totalWaste };
}

// Main optimization function
export function optimizeCutList(cutList: CutListItemForm[]): OptimizationResult {
  if (cutList.length === 0) {
    return {
      boardUsage: [],
      totalWaste: 0,
      wastePercentage: 0,
      totalBoards: 0,
      estimatedCost: 0,
      suggestions: ["Add items to your cut list to see optimization results."]
    };
  }
  
  // Group cuts by material and thickness
  const groupedCuts = new Map<string, CutPiece[]>();
  
  for (const item of cutList) {
    const key = `${item.material}-${item.thickness}`;
    if (!groupedCuts.has(key)) {
      groupedCuts.set(key, []);
    }
    groupedCuts.get(key)!.push({
      partName: item.partName,
      length: item.length,
      width: item.width,
      thickness: item.thickness,
      quantity: item.quantity
    });
  }
  
  const boardUsage: BoardUsage[] = [];
  const suggestions: string[] = [];
  let totalBoards = 0;
  let estimatedCost = 0;
  let totalUsedArea = 0;
  let totalAvailableArea = 0;
  
  // Process each material group
  const entries = Array.from(groupedCuts.entries());
  for (const [key, pieces] of entries) {
    const [material, thicknessStr] = key.split("-");
    const thickness = parseFloat(thicknessStr);
    
    const board = findBestBoard(pieces, material, thickness);
    if (!board) {
      suggestions.push(`No standard ${material} boards found for ${thickness}" thickness. Consider custom lumber.`);
      continue;
    }
    
    // Optimize cuts for this board type
    const { bins, totalWaste } = optimizeLinearCuts(pieces, board.dimensions.length);
    
    const boardsNeeded = bins.length;
    const usedLength = board.dimensions.length * boardsNeeded - totalWaste;
    const wastePercentage = (totalWaste / (board.dimensions.length * boardsNeeded)) * 100;
    
    boardUsage.push({
      product: board,
      pieces: pieces,
      usedLength,
      wastePercentage,
      boardsNeeded
    });
    
    totalBoards += boardsNeeded;
    estimatedCost += board.price * boardsNeeded;
    totalUsedArea += usedLength * board.dimensions.width;
    totalAvailableArea += board.dimensions.length * board.dimensions.width * boardsNeeded;
    
    // Generate suggestions
    if (wastePercentage > 30) {
      suggestions.push(
        `Consider combining smaller ${material} pieces to reduce ${wastePercentage.toFixed(0)}% waste.`
      );
    }
    
    if (boardsNeeded > 3) {
      const longerBoard = getProductsByMaterial(material).find(
        p => p.dimensions.length > board.dimensions.length && 
             p.dimensions.width >= board.dimensions.width
      );
      if (longerBoard) {
        suggestions.push(
          `Using longer ${material} boards (${longerBoard.dimensions.length}") might be more efficient.`
        );
      }
    }
  }
  
  const overallWaste = totalAvailableArea > 0 
    ? ((totalAvailableArea - totalUsedArea) / totalAvailableArea) * 100 
    : 0;
  
  if (suggestions.length === 0 && totalBoards > 0) {
    suggestions.push("Your cut list is well optimized! Waste is within acceptable limits.");
  }
  
  return {
    boardUsage,
    totalWaste: totalAvailableArea - totalUsedArea,
    wastePercentage: overallWaste,
    totalBoards,
    estimatedCost,
    suggestions
  };
}

// Calculate board feet waste
export function calculateWasteBoardFeet(result: OptimizationResult): number {
  return result.boardUsage.reduce((total, usage) => {
    const wasteArea = usage.product.dimensions.length * usage.product.dimensions.width * 
                      usage.boardsNeeded * (usage.wastePercentage / 100);
    return total + (wasteArea * usage.product.dimensions.thickness / 144);
  }, 0);
}

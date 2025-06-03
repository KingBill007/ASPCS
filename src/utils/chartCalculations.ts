
import { DataPoint, ControlLimits, ChartType } from "@/contexts/DataContext";

// Calculate average of a set of numbers
export const calculateMean = (values: number[]): number => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

// Calculate range of a set of numbers
export const calculateRange = (values: number[]): number => {
  return Math.max(...values) - Math.min(...values);
};

// Calculate X-bar chart limits
export const calculateXbarLimits = (
  data: DataPoint[], 
  a2: number
): ControlLimits => {
  // Calculate overall mean
  const subgroupMeans = data.map(point => calculateMean(point.values));
  const grandMean = calculateMean(subgroupMeans);
  
  // Calculate average range
  const subgroupRanges = data.map(point => calculateRange(point.values));
  const averageRange = calculateMean(subgroupRanges);
  
  // Calculate control limits
  const ucl = grandMean + a2 * averageRange;
  const lcl = grandMean - a2 * averageRange;
  
  return {
    ucl,
    cl: grandMean,
    lcl
  };
};

// Calculate R chart limits
export const calculateRLimits = (
  data: DataPoint[],
  d3: number,
  d4: number
): ControlLimits => {
  const subgroupRanges = data.map(point => calculateRange(point.values));
  const averageRange = calculateMean(subgroupRanges);
  
  return {
    ucl: d4 * averageRange,
    cl: averageRange,
    lcl: d3 * averageRange
  };
};

// Calculate C chart limits
export const calculateCLimits = (data: DataPoint[]): ControlLimits => {
  // For C chart, we assume each subgroup has a single count value
  const counts = data.map(point => point.values[0]);
  const averageCount = calculateMean(counts);
  
  return {
    ucl: averageCount + 3 * Math.sqrt(averageCount),
    cl: averageCount,
    lcl: Math.max(0, averageCount - 3 * Math.sqrt(averageCount))
  };
};

// Calculate P chart limits
export const calculatePLimits = (
  data: DataPoint[],
  sampleSize: number
): ControlLimits => {
  // For P chart, we assume each subgroup has a proportion value
  const proportions = data.map(point => point.values[0]);
  const averageProportion = calculateMean(proportions);
  
  const standardError = Math.sqrt(averageProportion * (1 - averageProportion) / sampleSize);
  
  return {
    ucl: Math.min(1, averageProportion + 3 * standardError),
    cl: averageProportion,
    lcl: Math.max(0, averageProportion - 3 * standardError)
  };
};

// Calculate control limits based on chart type
export const calculateControlLimits = (
  data: DataPoint[],
  chartType: ChartType,
  constants: { a2: number; d3: number; d4: number },
  sampleSize = 100 // Default sample size for P chart
): ControlLimits | null => {
  if (data.length === 0) return null;
  
  switch (chartType) {
    case "xbar":
      return calculateXbarLimits(data, constants.a2);
    case "r":
      return calculateRLimits(data, constants.d3, constants.d4);
    case "c":
      return calculateCLimits(data);
    case "p":
      return calculatePLimits(data, sampleSize);
    default:
      return null;
  }
};

// Check if a point is out of control
export const isOutOfControl = (
  value: number,
  limits: ControlLimits
): boolean => {
  return value > limits.ucl || value < limits.lcl;
};

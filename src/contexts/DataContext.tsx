
import { createContext, useState, useContext, ReactNode } from "react";

export type DataPoint = {
  subgroupId: string;
  values: number[];
  date?: string;
  productionNumber?: string;
  variable?: string;
  parameter?: string;
};

export type ControlLimits = {
  ucl: number;
  cl: number;
  lcl: number;
};

export type ChartType = "xbar" | "r" | "c" | "p";

export type ProductionConfig = {
  variable: string;
  parameter: string;
  sampleSize: number;
};

interface DataContextType {
  data: DataPoint[];
  setData: (data: DataPoint[]) => void;
  chartType: ChartType;
  setChartType: (chartType: ChartType) => void;
  controlLimits: ControlLimits | null;
  setControlLimits: (limits: ControlLimits | null) => void;
  constants: {
    a2: number;
    d3: number;
    d4: number;
  };
  setConstants: (constants: { a2: number; d3: number; d4: number }) => void;
  productionConfig: ProductionConfig | null;
  setProductionConfig: (config: ProductionConfig) => void;
  addDataPoint: (dataPoint: DataPoint) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [chartType, setChartType] = useState<ChartType>("xbar");
  const [controlLimits, setControlLimits] = useState<ControlLimits | null>(null);
  const [constants, setConstants] = useState({
    a2: 0.577, // Default for subgroup size 5
    d3: 0,     // Default for subgroup size 5
    d4: 2.115  // Default for subgroup size 5
  });
  const [productionConfig, setProductionConfig] = useState<ProductionConfig | null>(null);

  // Add a single data point and append to existing data
  const addDataPoint = (dataPoint: DataPoint) => {
    setData(prev => [...prev, dataPoint]);
  };

  return (
    <DataContext.Provider 
      value={{
        data,
        setData,
        chartType,
        setChartType,
        controlLimits,
        setControlLimits,
        constants,
        setConstants,
        productionConfig,
        setProductionConfig,
        addDataPoint
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

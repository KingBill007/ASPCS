
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { calculateMean, calculateRange, isOutOfControl } from "@/utils/chartCalculations";

const TrendAnalysis = () => {
  const navigate = useNavigate();
  const { data, chartType, controlLimits, productionConfig } = useData();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Redirect if no production config exists
  if (!productionConfig) {
    navigate("/");
    return null;
  }

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.filter(point => {
      if (!point.date) return true;
      
      const pointDate = new Date(point.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      
      return pointDate >= start && pointDate <= end;
    });
  }, [data, startDate, endDate]);

  // Transform data based on chart type
  const chartData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    switch (chartType) {
      case "xbar":
        return filteredData.map(point => ({
          subgroup: point.productionNumber || point.subgroupId,
          date: point.date,
          value: calculateMean(point.values),
          outOfControl: controlLimits ? 
            isOutOfControl(calculateMean(point.values), controlLimits) : false
        }));
      case "r":
        return filteredData.map(point => ({
          subgroup: point.productionNumber || point.subgroupId,
          date: point.date,
          value: calculateRange(point.values),
          outOfControl: controlLimits ? 
            isOutOfControl(calculateRange(point.values), controlLimits) : false
        }));
      case "c":
      case "p":
        return filteredData.map(point => ({
          subgroup: point.productionNumber || point.subgroupId,
          date: point.date,
          value: point.values[0],
          outOfControl: controlLimits ? 
            isOutOfControl(point.values[0], controlLimits) : false
        }));
      default:
        return [];
    }
  }, [filteredData, chartType, controlLimits]);

  // Get chart title based on chart type
  const getChartTitle = () => {
    switch (chartType) {
      case "xbar": return `X-bar Chart (${productionConfig?.parameter || "Mean"})`;
      case "r": return "R Chart (Range)";
      case "c": return "C Chart (Count)";
      case "p": return "P Chart (Proportion)";
      default: return "Control Chart";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trend Analysis</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Options</CardTitle>
          <CardDescription>
            Select a date range to filter the chart data. Leave blank to include all dates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {chartData.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p>No data available for the selected date range.</p>
            <Button onClick={() => navigate("/data-input")} className="mt-4">
              Add Data
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{getChartTitle()}</CardTitle>
            <CardDescription>
              Showing {chartData.length} data points
              {startDate && endDate ? ` from ${startDate} to ${endDate}` : 
               startDate ? ` from ${startDate} onwards` : 
               endDate ? ` until ${endDate}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="subgroup"
                    label={{ value: 'Production Number', position: 'insideBottomRight', offset: -10 }}
                  />
                  <YAxis
                    label={{ value: productionConfig?.parameter || 'Value', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value}`, productionConfig?.parameter || 'Value']}
                    labelFormatter={(label) => `Production: ${label}`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  />
                  {controlLimits && (
                    <>
                      <Line
                        type="monotone"
                        dataKey={() => controlLimits.ucl}
                        stroke="red"
                        strokeDasharray="3 3"
                        name="UCL"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={() => controlLimits.cl}
                        stroke="green"
                        name="CL"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={() => controlLimits.lcl}
                        stroke="red"
                        strokeDasharray="3 3"
                        name="LCL"
                        dot={false}
                      />
                    </>
                  )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="blue"
                    activeDot={{ r: 8 }}
                    dot={(props: any) => {
                      const isOut = chartData[props.index]?.outOfControl;
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={isOut ? 6 : 4}
                          fill={isOut ? "red" : "blue"}
                          strokeWidth={isOut ? 2 : 0}
                          stroke={isOut ? "darkred" : "none"}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <h3 className="font-semibold mb-2">Analysis Summary</h3>
              <p>Total Points: {chartData.length}</p>
              <p>Out of Control Points: {chartData.filter(point => point.outOfControl).length}</p>
              {chartData.filter(point => point.outOfControl).length > 0 && (
                <p className="text-red-600">
                  Warning: {chartData.filter(point => point.outOfControl).length} points exceed control limits.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/chart-selection")}>
              Change Chart Type
            </Button>
            <Button variant="outline" onClick={() => navigate("/data-input")}>
              Add More Data
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default TrendAnalysis;

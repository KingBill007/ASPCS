
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { isOutOfControl, calculateMean, calculateRange } from "@/utils/chartCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

const ChartVisualization = () => {
  const navigate = useNavigate();
  const { data, chartType, controlLimits } = useData();
  
  // Check if data and control limits are available
  const isDataAvailable = data && data.length > 0 && controlLimits;

  // Transform data based on chart type
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    switch (chartType) {
      case "xbar":
        return data.map(point => ({
          subgroup: point.subgroupId,
          value: calculateMean(point.values),
          outOfControl: controlLimits ? 
            isOutOfControl(calculateMean(point.values), controlLimits) : false
        }));
      case "r":
        return data.map(point => ({
          subgroup: point.subgroupId,
          value: calculateRange(point.values),
          outOfControl: controlLimits ? 
            isOutOfControl(calculateRange(point.values), controlLimits) : false
        }));
      case "c":
      case "p":
        return data.map(point => ({
          subgroup: point.subgroupId,
          value: point.values[0],
          outOfControl: controlLimits ? 
            isOutOfControl(point.values[0], controlLimits) : false
        }));
      default:
        return [];
    }
  }, [data, chartType, controlLimits]);
  
  // Get chart title based on chart type
  const getChartTitle = () => {
    switch (chartType) {
      case "xbar": return "X-bar Chart (Mean)";
      case "r": return "R Chart (Range)";
      case "c": return "C Chart (Count)";
      case "p": return "P Chart (Proportion)";
      default: return "Control Chart";
    }
  };
  
  // Count out-of-control points
  const outOfControlCount = chartData.filter(point => point.outOfControl).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chart Visualization</h1>
      
      {!isDataAvailable ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-4">
              <p className="mb-4">No data or control limits available. Please compute control limits first.</p>
              <Button onClick={() => navigate("/chart-selection")}>Go to Chart Selection</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{getChartTitle()}</CardTitle>
              <CardDescription>
                Control Chart with Upper Control Limit (UCL): {controlLimits?.ucl.toFixed(3)}, 
                Center Line (CL): {controlLimits?.cl.toFixed(3)}, 
                Lower Control Limit (LCL): {controlLimits?.lcl.toFixed(3)}
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
                      label={{ value: 'Subgroup', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis 
                      label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value, name) => [value, 'Value']}
                      labelFormatter={(label) => `Subgroup: ${label}`}
                    />
                    <ReferenceLine 
                      y={controlLimits.ucl} 
                      label="UCL" 
                      stroke="red" 
                      strokeDasharray="3 3" 
                    />
                    <ReferenceLine 
                      y={controlLimits.cl} 
                      label="CL" 
                      stroke="green"
                    />
                    <ReferenceLine 
                      y={controlLimits.lcl} 
                      label="LCL" 
                      stroke="red" 
                      strokeDasharray="3 3" 
                    />
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
                <p>Out of Control Points: {outOfControlCount}</p>
                {outOfControlCount > 0 && (
                  <p className="text-red-600">
                    Warning: {outOfControlCount} points exceed control limits, indicating potential process issues.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/chart-selection")}>
                Change Chart
              </Button>
              <Button variant="outline" disabled>
                Download Chart
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default ChartVisualization;

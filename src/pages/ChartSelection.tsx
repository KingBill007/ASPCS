
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { calculateControlLimits } from "@/utils/chartCalculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const ChartSelection = () => {
  const navigate = useNavigate();
  const { data, chartType, setChartType, constants, setControlLimits } = useData();
  const [calculatedLimits, setCalculatedLimits] = useState<{
    ucl: number;
    cl: number;
    lcl: number;
  } | null>(null);

  // Check if data is available
  const isDataAvailable = data && data.length > 0;
  
  // Compute control limits based on selected chart type
  const computeLimits = () => {
    if (!isDataAvailable) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: "Please input data before computing control limits.",
      });
      return;
    }
    
    const limits = calculateControlLimits(data, chartType, constants);
    
    if (limits) {
      setCalculatedLimits(limits);
      setControlLimits(limits);
      toast({
        title: "Control Limits Calculated",
        description: "Control limits have been calculated successfully.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Failed to calculate control limits. Please check your data.",
      });
    }
  };
  
  // Navigate to chart visualization page
  const viewChart = () => {
    if (!calculatedLimits) {
      toast({
        variant: "destructive",
        title: "No Control Limits",
        description: "Please compute control limits before viewing the chart.",
      });
      return;
    }
    
    navigate("/chart-visualization");
  };
  
  // Format number to 3 decimal places
  const formatNumber = (num: number) => {
    return Math.round(num * 1000) / 1000;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Chart Selection</h1>
      
      {!isDataAvailable ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-4">
              <p className="mb-4">No data available. Please input your data first.</p>
              <Button onClick={() => navigate("/data-input")}>Go to Data Input</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Chart Type</CardTitle>
              <CardDescription>Choose the type of control chart to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={chartType} 
                onValueChange={(value) => setChartType(value as "xbar" | "r" | "c" | "p")}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="xbar" id="xbar" />
                  <Label htmlFor="xbar">X-bar Chart (Mean)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="r" id="r" />
                  <Label htmlFor="r">R Chart (Range)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="c" id="c" />
                  <Label htmlFor="c">C Chart (Count)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="p" id="p" />
                  <Label htmlFor="p">P Chart (Proportion)</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button onClick={computeLimits}>Compute Control Limits</Button>
            </CardFooter>
          </Card>
          
          {calculatedLimits && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Calculated Control Limits</CardTitle>
                <CardDescription>Results for {chartType.toUpperCase()} chart</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-semibold text-red-600">UCL</h3>
                    <p className="text-2xl">{formatNumber(calculatedLimits.ucl)}</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-semibold text-green-600">CL</h3>
                    <p className="text-2xl">{formatNumber(calculatedLimits.cl)}</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h3 className="font-semibold text-red-600">LCL</h3>
                    <p className="text-2xl">{formatNumber(calculatedLimits.lcl)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={viewChart}>View Chart</Button>
              </CardFooter>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ChartSelection;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartBar } from "lucide-react";
import StartupPrompt from "@/components/StartupPrompt";
import { useData } from "@/contexts/DataContext";
import { useEffect, useState } from "react";

const Index = () => {
  const { productionConfig } = useData();
  const fullText = "Automated Statistical Process Control System";
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setAnimatedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50); // Adjust typing speed here
    return () => clearInterval(interval);
  }, []);

  if (!productionConfig) {
    return (
      <div className="flex flex-col items-center min-h-screen bg-white">
        <div className="text-center mb-8 mt-10">
          <div className="flex items-center justify-center mb-4">
            <ChartBar className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-4xl font-bold text-black drop-shadow-md">{animatedText}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive tool for researchers and analysts in food science to input data, 
            compute control limits, and visualize statistical control charts.
          </p>
        </div>
        <StartupPrompt />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <div className="text-center mb-8 mt-10">
        <div className="flex items-center justify-center mb-4">
          <ChartBar className="h-10 w-10 text-primary mr-2" />
          <h1 className="text-4xl font-bold text-black drop-shadow-md">{animatedText}</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive tool for researchers and analysts in food science to input data, 
          compute control limits, and visualize statistical control charts.
        </p>
        <div className="mt-4 p-4 border rounded-lg bg-muted/30">
          <h2 className="font-semibold text-lg">Current Configuration</h2>
          <p>Monitoring {productionConfig.parameter} of {productionConfig.variable}</p>
          <p>Sample Size: {productionConfig.sampleSize}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Data Input */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Data Input</CardTitle>
            <CardDescription>Upload a CSV file or manually enter your data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Start your analysis by inputting data through file upload or manual entry.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/data-input">Enter Data</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Chart Selection */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Chart Selection</CardTitle>
            <CardDescription>Choose chart type and compute control limits</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Select from X-bar, R, C, and P charts to analyze your process data.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/chart-selection">Select Chart</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Chart Visualization */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Chart Visualization</CardTitle>
            <CardDescription>View interactive control charts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Visualize your data with interactive charts showing control limits and out-of-control points.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/chart-visualization">View Charts</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Trend Analysis */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Analyze data trends with date-based filtering</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Filter your data by date range and visualize trends over time for deeper analysis.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/trend-analysis">Analyze Trends</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;

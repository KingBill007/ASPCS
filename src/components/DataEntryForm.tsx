import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData, DataPoint } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const DataEntryForm = () => {
  const navigate = useNavigate();
  const { productionConfig, addDataPoint } = useData();

  const [values, setValues] = useState<number[]>(
    Array(productionConfig?.sampleSize || 5).fill(0)
  );
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [productionNumber, setProductionNumber] = useState<string>(
    `PN-${Math.floor(10000 + Math.random() * 90000)}`
  );

  const updateValue = (index: number, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numericValue)) {
      const newValues = [...values];
      newValues[index] = numericValue;
      setValues(newValues);
    }
  };

  const handleSubmit = () => {
    if (!productionConfig) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Please complete the initial configuration first.",
      });
      navigate("/");
      return;
    }

    const hasInvalidValues = values.some((val) => isNaN(val));
    if (hasInvalidValues) {
      toast({
        variant: "destructive",
        title: "Invalid Data",
        description: "All measurements must be valid numbers.",
      });
      return;
    }

    const dataPoint: DataPoint = {
      subgroupId: productionNumber,
      values: values,
      date: date,
      productionNumber: productionNumber,
      variable: productionConfig.variable,
      parameter: productionConfig.parameter,
    };

    addDataPoint(dataPoint);

    toast({
      title: "Data Saved",
      description: `Added new data point for ${productionNumber}.`,
    });

    setValues(Array(productionConfig.sampleSize).fill(0));
    setProductionNumber(`PN-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  if (!productionConfig) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 px-4 py-8">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl bg-white p-6">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            Enter Production Data
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recording measurements for {productionConfig.variable}
            {productionConfig.parameter ? ` (${productionConfig.parameter})` : ""}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-5">
            <div>
              <Label htmlFor="productionNumber">Production Number</Label>
              <Input
                id="productionNumber"
                value={productionNumber}
                onChange={(e) => setProductionNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Production Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="block">
              Sample Measurements{" "}
              {productionConfig.parameter && `(${productionConfig.parameter})`}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <Input
                  key={index}
                  type="number"
                  value={value}
                  onChange={(e) => updateValue(index, e.target.value)}
                  placeholder={`Sample ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/chart-visualization")}
          >
            View Charts
          </Button>
          <Button onClick={handleSubmit}>Save Data</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DataEntryForm;

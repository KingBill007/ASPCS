import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';

const PRODUCTION_VARIABLES = [
  "Raw Material",
  "Packaging Type",
  "Machine Type",
  "Process Line",
];

const PRODUCTION_PARAMETERS: Record<string, { name: string; unit: string }[]> = {
  "Raw Material": [
    { name: "Moisture", unit: "%" },
    { name: "Temperature", unit: "°C" },
    { name: "Color", unit: "-" },
    { name: "pH", unit: "pH" },
    { name: "Density", unit: "g/cm³" },
    { name: "Impurity", unit: "%" },
    { name: "Ash Content", unit: "%" },
    { name: "Oil Content", unit: "%" },
    { name: "Fiber Content", unit: "%" },
    { name: "Contaminant Level", unit: "ppm" },
  ],
  "Packaging Type": [
    { name: "Size", unit: "cm" },
    { name: "Thickness", unit: "mm" },
    { name: "Durability", unit: "%" },
    { name: "Seal Strength", unit: "N" },
    { name: "Weight", unit: "g" },
    { name: "Tear Resistance", unit: "N" },
    { name: "Opacity", unit: "%" },
    { name: "Print Quality", unit: "grade" },
  ],
  "Machine Type": [
    { name: "Speed", unit: "rpm" },
    { name: "Temperature", unit: "°C" },
    { name: "Pressure", unit: "bar" },
    { name: "Efficiency", unit: "%" },
    { name: "Downtime", unit: "min/day" },
    { name: "Power Consumption", unit: "kWh" },
    { name: "Noise Level", unit: "dB" },
    { name: "Cycle Time", unit: "s" },
  ],
  "Process Line": [
    { name: "Viscosity", unit: "cP" },
    { name: "Texture", unit: "-" },
    { name: "Size", unit: "cm" },
    { name: "Odor", unit: "-" },
    { name: "Yield", unit: "%" },
    { name: "Flow Rate", unit: "L/min" },
    { name: "Residue", unit: "%" },
    { name: "Processing Time", unit: "min" },
    { name: "Foaming Level", unit: "%" },
  ],
};

const UNIT_OPTIONS = ["-", "%", "°C", "g/cm³", "pH", "cm", "mm", "N", "rpm", "bar", "kWh", "dB", "s", "L/min", "min", "ppm", "grade"];

const StartupPrompt = () => {
  const navigate = useNavigate();
  const { setProductionConfig } = useData();

  const [variable, setVariable] = useState("");
  const [variableType, setVariableType] = useState("");
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [sampleSize, setSampleSize] = useState<number>(5);
  const [customParam, setCustomParam] = useState("");
  const [customUnit, setCustomUnit] = useState("-");
  const [customParams, setCustomParams] = useState<{ name: string; unit: string }[]>([]);

  const availableParams = variable ? [...(PRODUCTION_PARAMETERS[variable] || []), ...customParams] : [];

  const toggleParam = (param: string) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const addCustomParam = () => {
    if (!customParam.trim()) return;

    const exists = availableParams.find(
      (p) => p.name.toLowerCase() === customParam.toLowerCase()
    );
    if (exists) {
      toast({
        variant: "destructive",
        title: "Duplicate Parameter",
        description: "This parameter already exists.",
      });
      return;
    }

    setCustomParams((prev) => [...prev, { name: customParam, unit: customUnit }]);
    setCustomParam("");
    setCustomUnit("-");
  };

  const handleSubmit = async () => {
    if (!variable || selectedParams.length === 0 || sampleSize < 1) {
      // toast({
      //   variant: "destructive",
      //   title: "Incomplete Configuration",
      //   description: "Please select variable, at least one parameter, and valid sample size.",
      // });
      //start
  try {
    await axios.get('http://localhost:3000'); // or some specific endpoint
    toast({
      variant: "default",
      title: "server reached",
      description: "Please complete all fields. Server is online.",
    });
  } catch (err) {
    toast({
      variant: "destructive",
      title: "Server Not Reachable",
      description: "Please check if backend is running.",
    });
  }
      //end
      return;
    }

    const config = {
      variable,
      variableType,
      parameters: selectedParams,
      sampleSize,
    };

    setProductionConfig(config);

    toast({
      title: "Configuration Saved",
      description: `Monitoring ${selectedParams.join(", ")} of ${variable} (${variableType}) with sample size ${sampleSize}.`,
    });

    navigate("/data-input");
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/backGimage.jpg')" }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 overflow-y-auto">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle>Initial Configuration</CardTitle>
            <CardDescription>
              Configure your production variable and parameters before data entry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Variable Selection */}
            <div className="space-y-2">
              <Label htmlFor="variable">Production Variable</Label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger id="variable">
                  <SelectValue placeholder="Select production variable" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTION_VARIABLES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type of Selected Variable */}
            {variable && (
              <div className="space-y-2">
                <Label htmlFor="variableType">Type of {variable}</Label>
                <Input
                  id="variableType"
                  placeholder={`Enter type of ${variable.toLowerCase()}`}
                  value={variableType}
                  onChange={(e) => setVariableType(e.target.value)}
                />
              </div>
            )}

            {/* Parameter Selection */}
            {variable && (
              <div className="space-y-2">
                <Label>Production Parameters</Label>
                <div className="grid gap-2 max-h-52 overflow-y-auto pr-2">
                  {availableParams.map(({ name, unit }) => (
                    <div key={name} className="flex items-center gap-2">
                      <Checkbox
                        id={name}
                        checked={selectedParams.includes(name)}
                        onCheckedChange={() => toggleParam(name)}
                      />
                      <Label htmlFor={name}>
                        {name} ({unit})
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Add Custom Parameter */}
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="customParam">Add Custom Parameter</Label>
                    <Input
                      id="customParam"
                      placeholder="Parameter name"
                      value={customParam}
                      onChange={(e) => setCustomParam(e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label>Unit</Label>
                    <Select value={customUnit} onValueChange={setCustomUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addCustomParam}>Add</Button>
                </div>
              </div>
            )}

            {/* Sample Size */}
            <div className="space-y-2">
              <Label htmlFor="sampleSize">Sample Size</Label>
              <Input
                id="sampleSize"
                type="number"
                min={1}
                max={20}
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-muted-foreground">
                Number of observations per subgroup.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full">
              Continue to Data Entry
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StartupPrompt;

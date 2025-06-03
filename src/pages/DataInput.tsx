
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData, DataPoint } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import DataEntryForm from "@/components/DataEntryForm";

const DataInput = () => {
  const navigate = useNavigate();
  const { setData, data, productionConfig } = useData();
  const [manualData, setManualData] = useState<DataPoint[]>([
    { subgroupId: "1", values: Array(productionConfig?.sampleSize || 5).fill(0) }
  ]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<DataPoint[]>([]);
  const [activeTab, setActiveTab] = useState("quick-entry");

  // Handle adding a new row to the manual data table
  const addRow = () => {
    const newSubgroupId = (manualData.length + 1).toString();
    setManualData([...manualData, { 
      subgroupId: newSubgroupId, 
      values: Array(productionConfig?.sampleSize || 5).fill(0) 
    }]);
  };

  // Handle removing a row from the manual data table
  const removeRow = (index: number) => {
    if (manualData.length > 1) {
      const updatedData = [...manualData];
      updatedData.splice(index, 1);
      setManualData(updatedData);
    }
  };

  // Handle updating a value in the manual data table
  const updateValue = (rowIndex: number, colIndex: number, value: string) => {
    const numericValue = value === "" ? 0 : parseFloat(value);
    if (!isNaN(numericValue)) {
      const updatedData = [...manualData];
      updatedData[rowIndex].values[colIndex] = numericValue;
      setManualData(updatedData);
    }
  };

  // Handle updating a subgroup ID in the manual data table
  const updateSubgroupId = (rowIndex: number, value: string) => {
    const updatedData = [...manualData];
    updatedData[rowIndex].subgroupId = value;
    setManualData(updatedData);
  };

  // Handle CSV file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      parseCSV(e.target.files[0]);
    }
  };

  // Parse CSV file
  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = text.split("\n");
        const headers = rows[0].split(",");
        const parsedData: DataPoint[] = [];

        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim() === "") continue;
          
          const values = rows[i].split(",");
          const subgroupId = values[0];
          const dataValues = values.slice(1).map(val => parseFloat(val.trim()));
          
          // Filter out any NaN values
          const validValues = dataValues.filter(val => !isNaN(val));
          
          if (validValues.length > 0) {
            parsedData.push({
              subgroupId,
              values: validValues,
              date: new Date().toISOString().split('T')[0],
              productionNumber: subgroupId,
              variable: productionConfig?.variable,
              parameter: productionConfig?.parameter
            });
          }
        }

        setCsvData(parsedData);
        toast({
          title: "CSV Parsed Successfully",
          description: `Loaded ${parsedData.length} data points from CSV.`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          variant: "destructive",
          title: "Error Parsing CSV",
          description: "Please ensure your CSV is formatted correctly.",
        });
      }
    };
    reader.readAsText(file);
  };

  // Save data and navigate to chart selection
  const saveData = () => {
    const dataToSave = activeTab === "manual" ? manualData : csvData;
    
    if (dataToSave.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data Available",
        description: "Please enter some data before proceeding.",
      });
      return;
    }
    
    // Enhance data with production config information
    const enhancedData = dataToSave.map(point => ({
      ...point,
      variable: point.variable || productionConfig?.variable,
      parameter: point.parameter || productionConfig?.parameter
    }));
    
    setData([...data, ...enhancedData]);
    toast({
      title: "Data Saved",
      description: `${dataToSave.length} data points saved successfully.`,
    });
    navigate("/chart-selection");
  };

  // Redirect to homepage if no production config exists
  if (!productionConfig) {
    navigate("/");
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Data Input Here</h1>
      
      <Tabs defaultValue="quick-entry" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="quick-entry">Quick Entry</TabsTrigger>
          <TabsTrigger value="manual">Batch Manual Entry</TabsTrigger>
          <TabsTrigger value="csv">Upload CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="quick-entry" className="space-y-4">
          <DataEntryForm />
          
          {data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Data Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Production #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Variable</TableHead>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Values</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.slice(-5).map((point, index) => (
                        <TableRow key={index}>
                          <TableCell>{point.productionNumber || point.subgroupId}</TableCell>
                          <TableCell>{point.date || "N/A"}</TableCell>
                          <TableCell>{point.variable || "N/A"}</TableCell>
                          <TableCell>{point.parameter || "N/A"}</TableCell>
                          <TableCell>{point.values.join(", ")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate("/chart-visualization")}>
                  View Current Charts
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Data Entry</CardTitle>
              <CardDescription>Enter your data point values manually in the table below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subgroup ID</TableHead>
                      {Array(productionConfig.sampleSize).fill(0).map((_, i) => (
                        <TableHead key={i}>Value {i + 1}</TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manualData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell>
                          <Input 
                            value={row.subgroupId}
                            onChange={(e) => updateSubgroupId(rowIndex, e.target.value)}
                          />
                        </TableCell>
                        {row.values.map((value, colIndex) => (
                          <TableCell key={colIndex}>
                            <Input 
                              type="number"
                              value={value}
                              onChange={(e) => updateValue(rowIndex, colIndex, e.target.value)}
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeRow(rowIndex)}
                            disabled={manualData.length <= 1}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button onClick={addRow} className="mt-4">Add Row</Button>
            </CardContent>
            <CardFooter>
              <Button onClick={saveData}>Save & Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CSV File Upload</CardTitle>
              <CardDescription>
                Upload a CSV file with your data. First column should be the Subgroup ID, 
                following columns should contain the measurements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="csvFile">Upload CSV File</Label>
                  <Input 
                    id="csvFile" 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                  />
                </div>
                
                {csvData.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <h3 className="font-semibold mb-2">Preview (showing first 5 rows):</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subgroup ID</TableHead>
                          {Array.from({ length: Math.max(...csvData.slice(0, 5).map(d => d.values.length)) }).map((_, i) => (
                            <TableHead key={i}>Value {i + 1}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.slice(0, 5).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell>{row.subgroupId}</TableCell>
                            {row.values.map((value, colIndex) => (
                              <TableCell key={colIndex}>{value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-2">
                      {csvData.length > 5 && `Showing 5 of ${csvData.length} rows.`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveData} disabled={csvData.length === 0}>Save & Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataInput;

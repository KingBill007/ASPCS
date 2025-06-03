
import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { constants, setConstants } = useData();
  
  // Local state for constants
  const [a2, setA2] = useState(constants.a2.toString());
  const [d3, setD3] = useState(constants.d3.toString());
  const [d4, setD4] = useState(constants.d4.toString());
  
  // Constants for common subgroup sizes
  const CONSTANTS_TABLE = {
    "2": { a2: 1.880, d3: 0, d4: 3.267 },
    "3": { a2: 1.023, d3: 0, d4: 2.575 },
    "4": { a2: 0.729, d3: 0, d4: 2.282 },
    "5": { a2: 0.577, d3: 0, d4: 2.115 },
    "6": { a2: 0.483, d3: 0, d4: 2.004 },
    "7": { a2: 0.419, d3: 0.076, d4: 1.924 },
    "8": { a2: 0.373, d3: 0.136, d4: 1.864 },
    "9": { a2: 0.337, d3: 0.184, d4: 1.816 },
    "10": { a2: 0.308, d3: 0.223, d4: 1.777 }
  };
  
  // Handle subgroup size change
  const handleSubgroupSizeChange = (size: string) => {
    if (size in CONSTANTS_TABLE) {
      const newConstants = CONSTANTS_TABLE[size as keyof typeof CONSTANTS_TABLE];
      setA2(newConstants.a2.toString());
      setD3(newConstants.d3.toString());
      setD4(newConstants.d4.toString());
    }
  };
  
  // Save constants
  const saveConstants = () => {
    const newA2 = parseFloat(a2);
    const newD3 = parseFloat(d3);
    const newD4 = parseFloat(d4);
    
    if (isNaN(newA2) || isNaN(newD3) || isNaN(newD4)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter valid numeric values for all constants.",
      });
      return;
    }
    
    setConstants({
      a2: newA2,
      d3: newD3,
      d4: newD4
    });
    
    toast({
      title: "Settings Saved",
      description: "Chart constants have been updated successfully.",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Control Chart Constants</CardTitle>
            <CardDescription>
              Configure control chart constants based on your subgroup size
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subgroupSize">Select Subgroup Size</Label>
              <Select onValueChange={handleSubgroupSizeChange}>
                <SelectTrigger id="subgroupSize">
                  <SelectValue placeholder="Choose subgroup size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CONSTANTS_TABLE).map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Selecting a subgroup size will automatically set the standard constants.
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label htmlFor="a2">A2 (for X-bar chart)</Label>
              <Input id="a2" value={a2} onChange={(e) => setA2(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="d3">D3 (for R chart LCL)</Label>
              <Input id="d3" value={d3} onChange={(e) => setD3(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="d4">D4 (for R chart UCL)</Label>
              <Input id="d4" value={d4} onChange={(e) => setD4(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveConstants}>Save Constants</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>About Control Charts</CardTitle>
            <CardDescription>
              Information about different control chart types and their applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">X-bar Chart</h3>
              <p className="text-sm text-muted-foreground">
                Used to monitor the mean of a process based on samples taken from the process at regular intervals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">R Chart</h3>
              <p className="text-sm text-muted-foreground">
                Used in conjunction with X-bar charts to monitor process variation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">C Chart</h3>
              <p className="text-sm text-muted-foreground">
                Used to monitor the total number of defects per unit when the size of the unit is constant.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">P Chart</h3>
              <p className="text-sm text-muted-foreground">
                Used to monitor the proportion of defective items in a process.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

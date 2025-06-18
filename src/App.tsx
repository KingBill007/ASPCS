
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataInput from "./pages/DataInput";
import ChartSelection from "./pages/ChartSelection";
import ChartVisualization from "./pages/ChartVisualization";
import TrendAnalysis from "./pages/TrendAnalysis";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
// import Login from "@/pages/Authpage"
import AuthPage from "@/pages/Authpage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/AuthPage" element={<AuthPage />} />
              <Route index element={<Index />} />
              <Route path="data-input" element={<DataInput />} />
              <Route path="chart-selection" element={<ChartSelection />} />
              <Route path="chart-visualization" element={<ChartVisualization />} />
              <Route path="trend-analysis" element={<TrendAnalysis />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

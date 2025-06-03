import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartBar } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b shadow-sm bg-black">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          <ChartBar className="h-6 w-6 text-white" />
          <Link to="/" className="font-semibold text-lg text-white">
            ASPCS
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-4 overflow-x-auto">
            <li>
              <Button variant="ghost" asChild className="text-white">
                <Link to="/">Home</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="text-white">
                <Link to="/data-input">Data Input</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="text-white">
                <Link to="/chart-selection">Chart Selection</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="text-white">
                <Link to="/chart-visualization">View Charts</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="text-white">
                <Link to="/trend-analysis">Trend Analysis</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="text-white">
                <Link to="/settings">Settings</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

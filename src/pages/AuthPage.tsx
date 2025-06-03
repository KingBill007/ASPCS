import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login or signup logic here
  };

  return (
    <div className="flex h-screen">
      {/* Left: Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="/Images/Authbanner.jpg" // Ensure the image is in public/Images/
          alt="Auth Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-300 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            <h1 className="text-3xl font-bold  text-center mb-6 ">Automated statistical process control system</h1>
            {isLogin ? "Login to your account" : "Create a new account"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-700 mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={handleToggle}
              className="text-blue-600 hover:underline ml-1 font-medium"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogin = (role) => {
    if (role === "admin") {
      navigate("/login/admin");
    } else {
      navigate("/login/customer");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative">
        {/* Clean Navbar */}
        <header className={`bg-white shadow-sm border-b border-gray-100 px-6 py-4 transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Reward Management System
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleLogin("customer")}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Customer Login
              </button>
              <button
                onClick={() => handleLogin("admin")}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-gray-500/25"
              >
                Admin Login
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className={`px-6 py-20 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Simplify Rewards,
              <br />
              <span className="text-blue-600">Boost Engagement</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Streamline your loyalty programs with our intuitive platform. Track purchases, 
              set reward policies, and help customers earn points effortlessly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-3 text-gray-700">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Real-time Analytics</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Easy Integration</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Smart Automation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleLogin("admin")}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={`px-6 py-20 bg-white transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">About Our Platform</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our Reward Management System helps businesses build stronger customer relationships 
              through intelligent loyalty programs. We provide a simple yet powerful platform where 
              businesses can create personalized reward strategies while customers enjoy seamless 
              point earning and redemption experiences.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className={`px-6 py-20 bg-gray-50 transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-16">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎯",
                  title: "Custom Reward Policies",
                  description: "Design flexible reward structures with advanced categorization and intelligent redemption rules.",
                  color: "blue"
                },
                {
                  icon: "⚡",
                  title: "Fast Transactions",
                  description: "Experience instant point earning and redemption with our optimized processing system.",
                  color: "green"
                },
                {
                  icon: "📊",
                  title: "Smart Analytics",
                  description: "Gain insights into customer behavior and engagement with comprehensive reporting tools.",
                  color: "purple"
                },
                {
                  icon: "🔒",
                  title: "Secure & Reliable",
                  description: "Enterprise-grade security ensures your data and transactions are always protected.",
                  color: "red"
                },
                {
                  icon: "📱",
                  title: "Real-time Reporting",
                  description: "Track points,redemptions, and customer activity instantly",
                  color: "indigo"
                },
                {
                  icon: "🚀",
                  title: "Scalable Solution",
                  description: "Built to grow with your business from startup to enterprise level operations.",
                  color: "orange"
                }
              ].map((feature, index) => {
                const colorClasses = {
                  blue: "bg-blue-50 border-blue-100 hover:border-blue-200",
                  green: "bg-green-50 border-green-100 hover:border-green-200",
                  purple: "bg-purple-50 border-purple-100 hover:border-purple-200",
                  red: "bg-red-50 border-red-100 hover:border-red-200",
                  indigo: "bg-indigo-50 border-indigo-100 hover:border-indigo-200",
                  orange: "bg-orange-50 border-orange-100 hover:border-orange-200"
                };
                
                return (
                  <div
                    key={index}
                    className={`${colorClasses[feature.color]} p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        

        {/* Footer */}
        <footer className={`bg-gray-900 px-6 py-12 transition-all duration-700 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-white font-semibold text-lg">Reward Management System</span>
            </div>
            <div className="text-center text-gray-400">
              <p className="mb-4">
                Empowering businesses to build lasting customer relationships through smart rewards.
              </p>
              <p>
                © {new Date().getFullYear()} Reward Management System. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
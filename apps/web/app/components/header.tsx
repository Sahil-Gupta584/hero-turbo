import { Button } from "@heroui/react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary text-2xl font-bold">
                ContentFlow
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#whyUs"
              className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Why Us
            </a>
            <a
              href="#features"
              className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Features
            </a>
            {/* <a
              href="#benefits"
              className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Benefits
            </a> */}
            <a
              href="#pricing"
              className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              Pricing
            </a>
            <a href="#pricing">
              <Button className="bg-primary text-white hover:bg-primary/90">
                Get Started
              </Button>
            </a>
          </div>
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-500 hover:text-primary focus:outline-none"
            >
              {mobileMenuOpen ? (
                <RxCross2 className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#features"
            className="block text-gray-600 hover:text-primary px-3 py-2 text-base font-medium"
            onClick={closeMobileMenu}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block text-gray-600 hover:text-primary px-3 py-2 text-base font-medium"
            onClick={closeMobileMenu}
          >
            How It Works
          </a>
          <a
            href="#benefits"
            className="block text-gray-600 hover:text-primary px-3 py-2 text-base font-medium"
            onClick={closeMobileMenu}
          >
            Benefits
          </a>
          <a
            href="#pricing"
            className="block text-gray-600 hover:text-primary px-3 py-2 text-base font-medium"
            onClick={closeMobileMenu}
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg text-base font-medium mt-2"
            onClick={closeMobileMenu}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

import { Button, Link } from "@heroui/react";
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
    <nav className="bg-white dark:bg-gray-800 dark:text-white backdrop-blur-md shadow-sm fixed inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-[#3f87df] text-2xl font-bold">
                ContentFlow
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#whyUs"
              className="text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-lg "
            >
              Why Us
            </a>
            <a
              href="#features"
              className="text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-lg "
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-lg "
            >
              Pricing
            </a>
            <Button
              as={Link}
              href="/auth"
              className="bg-[#3f87df] text-white hover:bg-[#3f87df]/90"
            >
              LogIn
            </Button>
          </div>
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-900 dark:text-gray-100 hover:text-[#3f87df] focus:outline-none"
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
            className="block text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-base "
            onClick={closeMobileMenu}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-base "
            onClick={closeMobileMenu}
          >
            How It Works
          </a>
          <a
            href="#benefits"
            className="block text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-base "
            onClick={closeMobileMenu}
          >
            Benefits
          </a>
          <a
            href="#pricing"
            className="block text-gray-900 dark:text-gray-100 hover:text-[#3f87df] px-3 py-2 text-base "
            onClick={closeMobileMenu}
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block bg-[#3f87df] text-white hover:bg-[#3f87df]/90 px-4 py-2 rounded-lg text-base font-medium mt-2"
            onClick={closeMobileMenu}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

import React, { useState } from 'react';
import { Recycle as Motorcycle, Home, Calendar, DollarSign, Users, Settings, Wrench } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ordenes', label: 'Órdenes', icon: Motorcycle },
    { id: 'preventivo', label: 'Preventivo', icon: Calendar },
    { id: 'balance', label: 'Balance', icon: DollarSign },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'mecanicos', label: 'Mecánicos', icon: Wrench },
    { id: 'configuracion', label: 'Config', icon: Settings },
  ];

  const handleNavigation = (page: string) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 gap-3">
            <div className="flex items-center space-x-3">
              <button
                className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Abrir menú"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Motorcycle className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">MotoTaller Pro</h1>
            </div>
            <div className="flex items-center space-x-4 text-right">
              <span className="text-xs sm:text-sm text-gray-500 leading-tight">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMenuOpen ? 'fixed inset-0 z-20' : 'hidden'} md:block md:relative md:z-0`}>
          {isMenuOpen && (
            <button
              aria-label="Cerrar menú"
              className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
          <nav
            className={`${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transform transition-transform duration-200 w-64 bg-white shadow-sm md:h-[calc(100vh-80px)] h-full overflow-y-auto fixed md:relative z-30`}
          >
            <div className="p-4 md:pt-6">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          currentPage === item.id
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
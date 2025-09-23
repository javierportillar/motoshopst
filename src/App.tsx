import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrdenTrabajo from './components/OrdenTrabajo';
import MantenimientoPreventivo from './components/MantenimientoPreventivo';
import Balance from './components/Balance';
import Configuracion from './components/Configuracion';
import { ServiciosProvider } from './context/ServiciosContext';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'ordenes':
        return <OrdenTrabajo />;
      case 'preventivo':
        return <MantenimientoPreventivo />;
      case 'balance':
        return <Balance />;
      case 'clientes':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
            <p className="text-gray-600 mt-2">Módulo en desarrollo</p>
          </div>
        );
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <ServiciosProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderCurrentPage()}
      </Layout>
    </ServiciosProvider>
  );
}

export default App;
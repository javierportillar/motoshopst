import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrdenTrabajo from './components/OrdenTrabajo';
import MantenimientoPreventivo from './components/MantenimientoPreventivo';
import Balance from './components/Balance';
import Configuracion from './components/Configuracion';
import Clientes from './components/Clientes';
import Mecanicos from './components/Mecanicos';
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
        return <Clientes />;
      case 'mecanicos':
        return <Mecanicos />;
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
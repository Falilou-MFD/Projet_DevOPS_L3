import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimulationResult from '../components/dashboard/SimulationResult';
import { AuthProvider } from '../context/AuthContext';

const mockResult = {
  kwh_total: 45.5,
  redevance: 500,
  taxe_communale: 200,
  tva: 900,
  tranches: [
    { nom: 'Tranche 1', montant: 2000, kwh: 20 },
    { nom: 'Tranche 2', montant: 3000, kwh: 25.5 },
  ],
  total: 5600,
};

const renderSimulationResult = () => {
  return render(
    <AuthProvider>
      <SimulationResult result={mockResult} montant={5000} />
    </AuthProvider>
  );
};

describe('SimulationResult Component', () => {
  test('affiche le résultat de la simulation', () => {
    renderSimulationResult();

    expect(screen.getByText(/Résultat de la simulation/i)).toBeInTheDocument();
    expect(screen.getByText(/45.5 kWh/i)).toBeInTheDocument();
    expect(screen.getByText(/5 600 FCFA/i)).toBeInTheDocument();
  });

  test('affiche les détails de facturation', () => {
    renderSimulationResult();

    expect(screen.getByText(/Redevance fixe/i)).toBeInTheDocument();
    expect(screen.getByText(/Taxe communale/i)).toBeInTheDocument();
    expect(screen.getByText(/TVA/i)).toBeInTheDocument();
  });

  test('affiche les tranches de consommation', () => {
    renderSimulationResult();

    expect(screen.getByText(/Tranche 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Tranche 2/i)).toBeInTheDocument();
  });

  test("affiche le bouton d'enregistrement", () => {
    renderSimulationResult();

    expect(screen.getByRole('button', { name: /Enregistrer cette recharge/i })).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AmountSimulator from '../components/dashboard/AmountSimulator';
import { api } from '../api/axios';

jest.mock('../api/axios');

describe('AmountSimulator Component', () => {
  const mockOnSimulationComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le formulaire de simulation', () => {
    render(<AmountSimulator onSimulationComplete={mockOnSimulationComplete} />);

    expect(screen.getByText(/Simuler une recharge/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Montant de la recharge/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simuler/i })).toBeInTheDocument();
  });

  test('affiche une erreur pour un montant invalide', async () => {
    render(<AmountSimulator onSimulationComplete={mockOnSimulationComplete} />);

    const input = screen.getByLabelText(/Montant de la recharge/i);
    const submitButton = screen.getByRole('button', { name: /Simuler/i });

    fireEvent.change(input, { target: { value: '-100' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Veuillez entrer un montant valide/i)).toBeInTheDocument();
    });
  });

  test('affiche une erreur si le montant est trop petit', async () => {
    render(<AmountSimulator onSimulationComplete={mockOnSimulationComplete} />);

    const input = screen.getByLabelText(/Montant de la recharge/i);
    const submitButton = screen.getByRole('button', { name: /Simuler/i });

    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Le montant minimum est de/i)).toBeInTheDocument();
    });
  });

  test('effectue une simulation avec succès', async () => {
    const mockResponse = {
      data: {
        kwh_total: 45.5,
        redevance: 500,
        taxe_communale: 200,
        tva: 900,
        tranches: [{ nom: 'Tranche 1', montant: 2000, kwh: 20 }],
        total: 5600,
      },
    };

    api.runSimulation.mockResolvedValue(mockResponse);

    render(<AmountSimulator onSimulationComplete={mockOnSimulationComplete} />);

    const input = screen.getByLabelText(/Montant de la recharge/i);
    const submitButton = screen.getByRole('button', { name: /Simuler/i });

    fireEvent.change(input, { target: { value: '5000' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.runSimulation).toHaveBeenCalledWith(5000);
      expect(mockOnSimulationComplete).toHaveBeenCalledWith(mockResponse.data, 5000);
    });
  });

  test('utilise le montant recommandé', () => {
    render(
      <AmountSimulator onSimulationComplete={mockOnSimulationComplete} recommendedAmount={8500} />
    );

    const recommendButton = screen.getByRole('button', {
      name: /Utiliser le montant recommandé/i,
    });

    fireEvent.click(recommendButton);

    const input = screen.getByLabelText(/Montant de la recharge/i);
    expect(input).toHaveValue(8500);
  });
});

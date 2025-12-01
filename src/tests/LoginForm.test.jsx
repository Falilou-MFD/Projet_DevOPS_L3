import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginForm from '../components/auth/LoginForm';
import { AuthProvider } from '../context/AuthContext';
import { api } from '../api/axios';

// Mock de l'API
jest.mock('../api/axios');

// Mock du useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le formulaire de connexion', () => {
    renderLoginForm();

    expect(screen.getByText(/Connexion Woyofal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Numéro de compteur/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  test('affiche une erreur si le compteur est vide', async () => {
    renderLoginForm();

    const submitButton = screen.getByRole('button', { name: /Se connecter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Veuillez entrer votre numéro de compteur/i)).toBeInTheDocument();
    });
  });

  test('soumet le formulaire avec succès', async () => {
    const mockResponse = {
      data: {
        token: 'test-token',
        typeUtilisateur: 'particulier',
        id_compteur: '123456',
        user: { name: 'Test User', email: 'test@example.com' },
      },
    };

    api.login.mockResolvedValue(mockResponse);

    renderLoginForm();

    const input = screen.getByLabelText(/Numéro de compteur/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('123456');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test("affiche une erreur en cas d'échec de connexion", async () => {
    api.login.mockRejectedValue({ response: { status: 401 } });

    renderLoginForm();

    const input = screen.getByLabelText(/Numéro de compteur/i);
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(input, { target: { value: 'wrong-number' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Numéro de compteur invalide/i)).toBeInTheDocument();
    });
  });
});

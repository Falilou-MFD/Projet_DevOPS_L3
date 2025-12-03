import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  ElectricBolt as ElectricIcon,
  Save as SaveIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import { formatCurrency, formatNumber } from '../../utils/format';
import { api } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function SimulationResult({ result, montant, onSaveSuccess }) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const { user } = useAuth();

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      await api.saveRecharge({
        compteur: user.compteur,
        montant,
        kwh: result.kwh_total,
        date: new Date().toISOString(),
      });
      setSaveMessage('Recharge enregistrée avec succès !');
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      setSaveMessage("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const DetailRow = ({ label, value, highlight = false }) => (
    <Box display="flex" justifyContent="space-between" py={1}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={highlight ? 600 : 400}
        color={highlight ? 'primary' : 'inherit'}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Résultat de la simulation
        </Typography>
        <Chip
          icon={<ElectricIcon />}
          label={`${formatNumber(result.kwh_total)} kWh`}
          color="primary"
          variant="filled"
        />
      </Box>

      <Box
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" mb={1}>
          Montant total
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {formatCurrency(result.total)}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="text"
        onClick={() => setShowDetails(!showDetails)}
        endIcon={showDetails ? <CollapseIcon /> : <ExpandIcon />}
        sx={{ mb: 2 }}
      >
        {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
      </Button>

      <Collapse in={showDetails}>
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Détails de la facturation
          </Typography>

          <DetailRow label="Redevance fixe" value={formatCurrency(result.redevance)} />
          <DetailRow label="Taxe communale" value={formatCurrency(result.taxe_communale)} />
          <DetailRow label="TVA (18%)" value={formatCurrency(result.tva)} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Répartition par tranches
          </Typography>

          {result.tranches.map((tranche, index) => (
            <Box key={index} mb={1}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    {tranche.nom}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" align="right">
                    {formatNumber(tranche.kwh)} kWh
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" align="right" fontWeight={500}>
                    {formatCurrency(tranche.montant)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <DetailRow label="Total kWh" value={`${formatNumber(result.kwh_total)} kWh`} highlight />
        </Box>
      </Collapse>

      {saveMessage && (
        <Alert severity={saveMessage.includes('succès') ? 'success' : 'error'} sx={{ mt: 2 }}>
          {saveMessage}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        color="secondary"
        size="large"
        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        onClick={handleSave}
        disabled={saving}
        sx={{ mt: 2 }}
      >
        {saving ? 'Enregistrement...' : 'Enregistrer cette recharge'}
      </Button>
    </Paper>
  );
}

export default SimulationResult;

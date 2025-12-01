import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
} from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { formatCurrency, formatDate, formatNumber } from '../../utils/format';

function PurchaseHistory({ history }) {
  if (!history || !history.achats || history.achats.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Historique des achats
        </Typography>
        <Box textAlign="center" py={4}>
          <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Aucun achat enregistré pour le moment
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Historique des achats
        </Typography>
        <Chip label={`${history.achats.length} achats`} size="small" color="primary" />
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Montant</strong>
              </TableCell>
              <TableCell align="right">
                <strong>kWh</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.achats.map((achat, index) => (
              <TableRow key={index} hover>
                <TableCell>{formatDate(achat.date)}</TableCell>
                <TableCell align="right">{formatCurrency(achat.montant)}</TableCell>
                <TableCell align="right">{formatNumber(achat.kwh)} kWh</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default PurchaseHistory;

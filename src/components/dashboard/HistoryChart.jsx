import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp as ChartIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function HistoryChart({ history }) {
  const theme = useTheme();

  if (!history || !history.consommation_mensuelle) {
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Consommation mensuelle
        </Typography>
        <Box textAlign="center" py={4}>
          <ChartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Aucune donnée de consommation disponible
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Préparer les données pour le graphique
  const chartData = history.consommation_mensuelle.mois.map((mois, index) => ({
    mois,
    kwh: history.consommation_mensuelle.kwh[index],
  }));

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Consommation mensuelle
      </Typography>

      <Box sx={{ width: '100%', height: 300, mt: 2 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="mois"
              stroke={theme.palette.text.secondary}
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={{ fontSize: '0.875rem' }}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
              formatter={(value) => [`${value} kWh`, 'Consommation']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="kwh"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ fill: theme.palette.primary.main, r: 5 }}
              activeDot={{ r: 7 }}
              name="Consommation (kWh)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default HistoryChart;

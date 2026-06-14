import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';

import { Language } from '../i18n/translations';
import { CoinHistory } from '../models/coin.model';
import { CHART_DATE_FORMATTERS, USD_COMPACT_FORMATTER, USD_FORMATTER } from '../utils/coin-format.util';

// Sincronizados con los design tokens de styles.scss / tailwind.config.js
const CHART_LINE_COLOR = '#3b82f6';
const CHART_FILL_TOP = 'rgba(59, 130, 246, 0.25)';
const CHART_FILL_BOTTOM = 'rgba(59, 130, 246, 0)';
const CHART_TICK_COLOR = '#6b7280';
const CHART_TOOLTIP_BG = '#1a1d27';

/**
 * Encapsula la creación y actualización de la gráfica de precios (Chart.js).
 * Una instancia por componente de detalle evita fugas entre navegaciones.
 */
@Injectable()
export class PriceChartService {
  private chart: Chart | null = null;

  render(canvas: HTMLCanvasElement, history: CoinHistory, language: Language): void {
    const dateFormatter = CHART_DATE_FORMATTERS[language];
    const labels = history.prices.map(([timestamp]) => dateFormatter.format(timestamp));
    const data = history.prices.map(([, price]) => price);

    if (this.chart !== null) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
      return;
    }

    const context = canvas.getContext('2d');
    if (context === null) {
      return;
    }

    const gradient = context.createLinearGradient(0, 0, 0, canvas.clientHeight || 320);
    gradient.addColorStop(0, CHART_FILL_TOP);
    gradient.addColorStop(1, CHART_FILL_BOTTOM);

    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data,
            borderColor: CHART_LINE_COLOR,
            backgroundColor: gradient,
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: CHART_LINE_COLOR,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: CHART_TOOLTIP_BG,
            borderColor: CHART_FILL_TOP,
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (item) =>
                item.parsed.y !== null ? USD_FORMATTER.format(item.parsed.y) : '',
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: CHART_TICK_COLOR, maxTicksLimit: 6, maxRotation: 0 },
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: CHART_TICK_COLOR,
              maxTicksLimit: 5,
              callback: (value) =>
                typeof value === 'number' ? USD_COMPACT_FORMATTER.format(value) : value,
            },
          },
        },
      },
    });
  }

  destroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}

# CryptoTracker

Aplicación web para seguir el mercado de criptomonedas en tiempo real: precios, capitalización, históricos interactivos y lista de favoritos. Construida con Angular moderno (standalone components + signals) y la API pública de [CoinGecko](https://www.coingecko.com/es/api).

![Screenshot de CryptoTracker](docs/screenshot.png)

> 📸 _Screenshot pendiente: guarda una captura en `docs/screenshot.png`._

🔗 **Demo en vivo**: [próximamente](#)

## ✨ Funcionalidades

- **Top 50 criptomonedas** ordenadas por capitalización de mercado, con precio, cambio 24h y volumen.
- **Búsqueda instantánea** por nombre o símbolo, con `debounceTime` y sin llamadas extra a la API.
- **Página de detalle** con descripción, badges de cambio 24h/7d y **gráfica de precios interactiva** (rangos de 7, 14 y 30 días) renderizada con Chart.js.
- **Favoritos persistentes** en localStorage, con contador en vivo en el navbar.
- **Modo oscuro/claro** con preferencia persistente (oscuro por defecto).
- **Diseño responsivo** mobile-first: 1 columna en móvil, 2 en tablet, 3–4 en desktop.
- **Manejo de errores visible**: mensajes con contexto y botón de reintento en cada vista.

## 🛠️ Tecnologías

| Tecnología | Uso |
| --- | --- |
| [Angular 21](https://angular.dev) | Framework SPA — standalone components, signals, control flow (`@if`/`@for`), lazy loading |
| [TypeScript](https://www.typescriptlang.org/) (strict) | Tipado estricto de toda la app, sin `any` |
| [TailwindCSS 3](https://tailwindcss.com/) | Estilos utility-first, dark mode con estrategia `class` |
| [RxJS](https://rxjs.dev/) | Flujos reactivos: `switchMap`, `combineLatest`, `debounceTime`, `catchError` |
| [Chart.js](https://www.chartjs.org/) | Gráfica de histórico de precios |
| [CoinGecko API](https://www.coingecko.com/es/api) | Datos de mercado (sin API key, plan gratuito) |

## 🏗️ Arquitectura

```
src/app/
├── core/                 # Lógica de negocio singleton
│   ├── services/         # CryptoService (API), FavoritesService, ThemeService
│   └── models/           # Interfaces tipadas de la API (Coin, CoinDetail, CoinHistory)
├── shared/               # Componentes dumb reutilizables
│   └── components/       # navbar, search-bar, coin-card, loading-spinner
├── pages/                # Componentes smart, uno por ruta (lazy loaded)
│   ├── home/             # Listado + búsqueda
│   ├── coin-detail/      # Detalle + gráfica
│   └── favorites/        # Favoritos del usuario
└── app.routes.ts         # Routing centralizado con lazy loading
```

Principios aplicados: componentes de página *smart* / compartidos *dumb*, `ChangeDetectionStrategy.OnPush` en toda la app, estado local con signals, estado compartido con `BehaviorSubject` expuesto como `Observable`/`Signal`, y manejo de errores centralizado en los servicios con `catchError`.

## 🚀 Instalación

Requisitos: [Node.js](https://nodejs.org/) 22+ y npm.

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/crypto-tracker.git
cd crypto-tracker

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm start
```

Abre [http://localhost:4200](http://localhost:4200) en el navegador.

### Otros comandos

```bash
npm run build    # Build de producción (dist/crypto-tracker)
npm test         # Tests unitarios
```

## ⚙️ Configuración

La URL base de la API y el número de monedas por página se configuran en `src/environments/`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.coingecko.com/api/v3',
  coinsPerPage: 50,
};
```

> **Nota**: el plan gratuito de CoinGecko tiene límite de peticiones por minuto. Si ves errores de carga, espera unos segundos y usa el botón **Reintentar**.

## 📄 Licencia

MIT

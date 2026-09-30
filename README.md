# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Northline Motor Co.

  A responsive car dealership marketplace built with React, TypeScript, and Vite. Visitors can browse an example inventory, compare vehicle details, explore financing estimates, and walk through a sample car-selling offer.

  ## Getting Started

  Requirements: Node.js and npm.

  ```sh
  npm install
  npm run dev
  ```

  Open the local URL printed by Vite to view the app. To create and preview a production build:

  ```sh
  npm run build
  npm run preview
  ```

  ## Features

  - Browse and filter vehicles by condition, make, model, year, price, mileage, and fuel type; sort results and switch between grid and list views.
  - Open vehicle detail pages and save vehicles for the current browser session.
  - Use the five-step sell-or-trade flow to enter vehicle details and see an illustrative estimate.
  - Adjust financing assumptions in the payment estimator and explore the pre-approval form.
  - Switch between light and dark themes. The selected theme is stored in local browser storage.
  - Use responsive layouts for desktop and mobile screens.

  The inventory and calculations are sample frontend data. The valuation and financing forms are demonstrations and are not connected to dealership, lender, or vehicle-history services.

  ## Scripts

  | Command | Description |
  | --- | --- |
  | `npm run dev` | Start the Vite development server. |
  | `npm run build` | Type-check and create a production build in `dist/`. |
  | `npm run preview` | Serve the production build locally. |
  | `npm run lint` | Run ESLint across the project. |

  ## Project Structure

  ```text
  src/
    components/   Shared navigation, footer, vehicle cards, and UI components
    context/      Theme and marketplace state
    data/         Sample vehicle inventory
    lib/          Formatting helpers
    pages/        Home, inventory, vehicle, sell, finance, and contact pages
    App.tsx       Application providers and route definitions
    dealership.css
    theme.css
  ```

  ## Tech Stack

  - React 19 and TypeScript
  - Vite
  - React Router
  - Tailwind CSS 4 and project-specific CSS
  - Framer Motion
  - Lucide icons

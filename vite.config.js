import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from external devices / domains
    port: 5173,
    allowedHosts: ['firewall.net'], // <-- allow this domain
    hmr: {
      protocol: 'ws',
      host: 'firewall.net',
      port: 5173,
    },
  },
});

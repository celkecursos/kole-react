import { defineConfig, devices } from '@playwright/test';

/**
 * Teste visual da demo: tira um print de cada página (tema claro e escuro) e
 * compara com a referência em tests/visual/__referencia__/<sistema>/.
 *
 *   npm run visual:referencia   # gera a referência ANTES de mexer no CSS
 *   npm run visual              # depois da mudança: aponta toda diferença
 *
 * O print muda de um sistema operacional para outro, então cada um tem a sua
 * pasta. Só a de Linux vai para o git: é a que o CI (.github/workflows/visual.yml)
 * usa, gerada na imagem Docker do Playwright. Para comparar com outra versão,
 * rode-a num servidor próprio e aponte KOLE_URL para ele ao gerar a referência
 * — sem KOLE_URL, sobe o `vite` daqui.
 */
const PORTA = 5180;
const externo = process.env['KOLE_URL'];

export default defineConfig({
  testDir: './tests/visual',
  snapshotPathTemplate: '{testDir}/__referencia__/{platform}/{projectName}/{arg}{ext}',
  fullyParallel: true,
  retries: 0,
  forbidOnly: !!process.env['CI'],
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css', maxDiffPixels: 0 },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: externo ?? `http://localhost:${PORTA}`,
    viewport: { width: 1440, height: 900 },
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },
  projects: [
    { name: 'claro', use: { colorScheme: 'light' } },
    { name: 'escuro', use: { colorScheme: 'dark' } },
    // tema "sistema" com o sistema no escuro: tem que sair igual ao escuro (compara com a mesma referência;
    // fica fora do visual:referencia, que só grava claro e escuro)
    { name: 'sistema', use: { colorScheme: 'dark' }, snapshotPathTemplate: '{testDir}/__referencia__/{platform}/escuro/{arg}{ext}' },
  ],
  webServer: externo
    ? undefined
    : { command: `npx vite --port ${PORTA} --strictPort`, url: `http://localhost:${PORTA}`, reuseExistingServer: true },
});

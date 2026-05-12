// PM2 ecosystem для прода на Beget.
// .env подгружается в окружение перед `pm2 startOrReload` (см. deploy-app.sh),
// здесь только маппинг NUXT_* и базовые переменные.
module.exports = {
  apps: [
    {
      name: 'radde-site',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '512M',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '3000',
        // Nuxt runtimeConfig подхватывает через NUXT_*-конвертацию camelCase
        NUXT_DATABASE_URL: process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL || '',
        NUXT_TELEGRAM_BOT_TOKEN: process.env.NUXT_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '',
        NUXT_TELEGRAM_CHAT_ID: process.env.NUXT_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '',
      },
    },
  ],
}

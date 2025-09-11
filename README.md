AVI Lab (PWA)

Objetivo
- PWA independiente para experimentar, probar y entrenar el algoritmo de voz (AVI).
- Flujo demo: grabar audio → enviar al BFF (/v1/voice/evaluate-audio) → ver voiceScore/flags/decision → exportar dataset.

Estructura (resumen)
- src/app/core: contratos y ApiConfig
- src/app/services: VoiceApi + AudioRecorder
- src/app/pages: Runner (entrevista) + Metrics (métricas API)

Comandos
- Instala dependencias: npm install
- Desarrollo: npm start
- Producción: npm run build

Configurar API
- Edita src/environments/environment.ts (apiBaseUrl, mock)

Mock Mode
- En la UI, activa/desactiva Mock para usar respuestas locales (sin backend).

Backend esperado
- POST /v1/voice/evaluate-audio (multipart/form-data)
- POST /v1/voice/analyze (features pre-extraídas)
- POST /v1/voice/whisper-transcribe (transcripción + words)


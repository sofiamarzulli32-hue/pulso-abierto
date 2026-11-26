# Pulso Abierto

Pulso Abierto es una aplicación web académica desarrollada con React y TypeScript para consultar los precios de **Bitcoin, Ethereum y Solana** mediante la API pública de CoinGecko. Permite filtrar y ordenar resultados, acceder a una vista de detalle, administrar favoritos compartidos entre vistas y conservarlos después de recargar la aplicación.

## Tecnologías principales

- React 18
- TypeScript
- Vite
- React Router
- Zustand con persistencia en `localStorage`
- Zod
- Fetch API
- Vitest
- Testing Library
- user-event

## Requisitos

- Node.js
- npm

## Instalación

Clonar el repositorio y, desde la raíz del proyecto, instalar las dependencias:

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Vite mostrará una dirección local, normalmente `http://localhost:5173`.

## Pruebas automatizadas

```bash
npm run test
```

Las pruebas cubren comportamientos relevantes de favoritos, consulta de datos, error/reintento y la capa de servicio sin realizar solicitudes reales a CoinGecko.

## Build productivo

```bash
npm run build
```

El resultado del build se genera en la carpeta `dist/`.

## Comprobar el build

```bash
npm run preview
```

Este comando permite revisar localmente la versión productiva generada.

## API y variables de entorno

La aplicación utiliza la API pública de CoinGecko para consultar Bitcoin, Ethereum y Solana. En esta versión no se requieren variables de entorno ni claves privadas.

## Persistencia

Los identificadores de criptomonedas favoritas se almacenan en `localStorage` mediante el middleware `persist` de Zustand, bajo la clave `pulso-abierto-favorites`. Los estados de carga y error no forman parte de la persistencia.

## Navegación y despliegue

La aplicación utiliza React Router. Se incluye `vercel.json` con una regla de reescritura hacia `index.html`, necesaria para que las rutas de detalle puedan abrirse o recargarse directamente en Vercel.

### Configuración de Vercel

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## URL pública

**Vercel:** completar después del despliegue: `https://TU-PROYECTO.vercel.app`

## Repositorio

**GitHub:** completar con la URL del repositorio utilizado para la entrega.

## Mejora de mantenibilidad realizada en la versión final

**Problema identificado:** el formateo de moneda USD estaba definido por separado en `CryptoCard.tsx` y `CryptoDetailPage.tsx`, lo que duplicaba la misma configuración y podía generar inconsistencias si se modificaba en una sola vista.

**Cambio realizado:** se extrajo el formateador a `src/utils/formatters.ts` y ambas vistas reutilizan ahora la misma instancia `usdCurrency`.

**Comprobación de regresiones:** después del cambio se ejecutaron las pruebas automatizadas y el build productivo. También se verificó que el listado y el detalle continuaran mostrando los precios con el mismo formato.

## Publicación en GitHub

Antes del despliegue se debe comprobar que `node_modules/`, `dist/` y archivos locales no estén versionados. El proyecto incluye `.gitignore` con esas exclusiones.

Ejemplo de comandos para publicar la versión final:

```bash
git status
git add .
git commit -m "Preparar versión final de Pulso Abierto"
git push
```

## Verificación final

- Pruebas ejecutadas: `npm run test`
- Build generado: `npm run build`
- Preview productivo: `npm run preview`
- Recorridos revisados: consulta de precios, navegación listado/detalle, favoritos entre vistas, persistencia después de recargar y validación del formulario.
- Despliegue en Vercel: **pendiente de completar desde la cuenta de la estudiante**.
- Fecha de verificación: **21/11/2026**.

> Después del despliegue, reemplazar las URLs pendientes de GitHub y Vercel y actualizar “Despliegue en Vercel” a “realizado”.

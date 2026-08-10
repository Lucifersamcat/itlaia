# Atlas IA

Prototipo estático y responsivo de una enciclopedia educativa de inteligencia artificial.

## Abrir el sitio

Se puede abrir `index.html` directamente en un navegador. Para probarlo mediante un servidor local:

```powershell
npx serve .
```

## Publicar en GitHub Pages

El proyecto incluye el flujo `.github/workflows/deploy-pages.yml`. Cada cambio
enviado a la rama `main` se publica automáticamente.

1. Crear un repositorio vacío en GitHub.
2. En **Settings > Pages > Build and deployment**, seleccionar **GitHub Actions**.
3. En esta carpeta, ejecutar:

```powershell
git init
git add .
git commit -m "Publicar Atlas IA en GitHub Pages"
git branch -M main
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

La dirección pública será `https://USUARIO.github.io/REPOSITORIO/`.

## Secciones

- Buscador principal y conceptos destacados.
- Glosario ampliado con búsqueda, índice alfabético y fichas enlazables.
- Glosario actualizado con conceptos de hardware, licencias, seguridad, despliegue, modelos abiertos e IA física.
- Fichas dedicadas con explicación, ejemplo, funcionamiento, riesgos y conceptos relacionados.
- Catálogo de 27 empresas, aplicaciones y familias de modelos con perfiles detallados.
- Cobertura de modelos generales, empresariales, abiertos, imagen, video, audio, música, 3D y robótica.
- Modelos concretos con modalidad, orientación, contexto y precios de API cuando existe una tarifa oficial.
- Comparador de hasta cuatro productos con categorías separadas para asistentes generales y agentes de programación.
- Categorías adicionales para modelos por API, imagen, video, voz y audio, modelos abiertos, plataformas empresariales e IA física.
- Escenarios que reordenan los criterios: investigación, documentos, oficina, privacidad, repositorios, pull requests, terminal y equipos.
- Vistas de resumen, comparación completa y solo diferencias.
- Evidencia por celda con condición, plan, fuente oficial y fecha de verificación.
- Sección de preguntas frecuentes para el Taller ITLA Manejo de IA, con búsqueda, filtros temáticos y enlaces al glosario.

Los datos actuales son demostrativos. Los precios, capacidades y disponibilidad deberán conectarse posteriormente con perfiles revisados y fuentes oficiales.

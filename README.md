# Atlas IA

Atlas IA es un sitio educativo creado para ayudar a estudiantes y personas curiosas a comprender la inteligencia artificial con un lenguaje claro y práctico.

Su objetivo es hacer que los conceptos de IA sean más accesibles, ofreciendo explicaciones sencillas sobre términos importantes, empresas, modelos y herramientas actuales.

## Qué encontrarás

- Un glosario de conceptos esenciales de inteligencia artificial.
- Información para distinguir empresas, aplicaciones y modelos.
- Un comparador para explorar distintas soluciones según una necesidad concreta.
- Preguntas frecuentes orientadas al uso responsable de la IA.
- Una sección de aprendizaje con una guía básica para usar Git y GitHub desde la consola.

Atlas IA busca promover un uso informado, crítico y responsable de la tecnología. La información se presenta con fines educativos y puede simplificar algunos temas para facilitar el aprendizaje.

## Ejecutar localmente

El sitio es estático y puede abrirse directamente desde `index.html`. Para probarlo con un servidor local:

```powershell
npx serve .
```

## Publicación

El flujo `.github/workflows/deploy-pages.yml` publica automáticamente el sitio en GitHub Pages cuando se envían cambios a la rama `main`. En la configuración del repositorio, GitHub Pages debe usar **GitHub Actions** como fuente de publicación.

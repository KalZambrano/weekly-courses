# DOCUMENTACION_CAMBIOS.md

## 1. Resumen Ejecutivo
Este documento recopila la reestructuración integral llevada a cabo en el **Sistema Educativo**. El objetivo primordial de esta intervención consistió en realizar una depuración controlada ("purga de fábrica") de la base de datos `sistema.db` y unificar la experiencia multi-rol del sistema para asegurar su correcto comportamiento visual y funcional. A su vez, se optimizó el flujo de carga de recursos del docente (permitiendo el almacenamiento de archivos reales) y se erradicaron advertencias críticas del ciclo de vida de React en el frontend.

---

## 2. Arquitectura de Base de Datos y Seguridad (FastAPI)

### Campo de Organización Temporal: `semana`
Para organizar y dosificar pedagógicamente los contenidos didácticos, se incorporó un nuevo atributo entero `semana` (del 1 al 18) en las siguientes entidades del backend:
* **`material-curso-table`**: Modificación aplicada en el modelo SQLAlchemy `MaterialCurso` de [material_curso.py](file:///C:/Users/operador/Desktop/Sistema-Educativo/Sistema_Educativo_FastApi/app/models/material_curso.py) y en sus correspondientes esquemas de validación Pydantic `MaterialCursoRequest` y `MaterialCursoResponse`.
* **`evaluacion-curso-table`**: Incorporación correspondiente en la entidad `EvaluacionCurso` de [evaluacion_curso.py](file:///C:/Users/operador/Desktop/Sistema-Educativo/Sistema_Educativo_FastApi/app/models/evaluacion_curso.py) y en los esquemas `EvaluacionCursoRequest` y `EvaluacionCursoResponse`.
* **Migración Física:** Se ejecutaron sentencias directas de alteración de base de datos (`ALTER TABLE ADD COLUMN`) sobre la base SQLite para inyectar esta columna de forma totalmente compatible con registros preexistentes.

### Unificación del Estado: `habilitado`
Existía una discrepancia entre los esquemas que provocaba que los docentes y administradores se mostraran visualmente como "Inhabilitado".
* **Solución Técnica:** Se inyectó una propiedad helper `@property` dentro del modelo `Asistente` de SQLAlchemy:
  ```python
  @property
  def habilitado(self) -> bool:
      return self.habilitadoEmpleado if self.habilitadoEmpleado is not None else True
  ```
* Esto expone de forma directa la propiedad `habilitado` a través de `AsistenteResponse` de Pydantic, garantizando que el frontend consuma `tc.habilitado` con el valor exacto de la base de datos (resolviendo el valor *undefined* anterior).

---

## 3. Sistema de Carga Física de Archivos

### Flujo de Carga Multipart (`Form` y `UploadFile`)
Anteriormente, los enlaces de diapositivas o documentos eran de texto plano. Ahora, el sistema permite cargar archivos binarios reales:
* **Endpoint Modificado:** El endpoint `POST /materialCurso/addMaterialCurso` en [material_curso.py](file:///C:/Users/operador/Desktop/Sistema-Educativo/Sistema_Educativo_FastApi/app/api/routers/material/material_curso.py) fue adaptado para aceptar datos de tipo multipart/form-data. Recibe campos del formulario mediante `Form(...)` y un archivo opcional `file: UploadFile = File(None)`.
* **Almacenamiento Físico Seguro:** Si se detecta un archivo adjunto, se le asigna un nombre único con hash UUID (manteniendo su extensión) y se almacena en el servidor en el directorio `public/uploads/materials`.
* **Acceso Estático:** En [main.py](file:///C:/Users/operador/Desktop/Sistema-Educativo/Sistema_Educativo_FastApi/app/main.py) se montó este directorio estático usando `StaticFiles` de FastAPI:
  ```python
  app.mount("/public", StaticFiles(directory="public"), name="public")
  ```
  La URL de acceso local generada y almacenada en la base de datos es: `/public/uploads/materials/<hash>.<ext>`.

### Adaptabilidad del Cliente API en el Frontend
* **Archivo Modificado:** [api.ts](file:///C:/Users/operador/Desktop/Sistema-Educativo/weekly-courses/lib/api.ts)
* **Solución:** Se editó el cliente HTTP `fetchApi` para verificar de forma dinámica si el parámetro `options.body` es una instancia de `FormData`. En ese escenario, se remueve el encabezado predefinido `Content-Type: application/json` permitiendo al navegador establecer de forma nativa el formato correcto `multipart/form-data` con su respectivo `boundary`.

---

## 4. Refactorización del Frontend (Next.js - TypeScript)

### Experiencia de Inicio de Sesión
* **Login Autopoblable:** Modificación de [page.tsx (login)](file:///C:/Users/operador/Desktop/Sistema-Educativo/weekly-courses/app/%28auth%29/login/page.tsx) para incluir tres tarjetas e independientes correspondientes a los usuarios semilla (Seeds) insertados en la base de datos:
  * **Administrador:** Zaiko Tsakio (DNI: 87654321 / Clave: 12345)
  * **Docente:** Juan Pérez (DNI: 11223344 / Clave: 12345)
  * **Estudiante:** Estudiante Mock (DNI: 55555555 / Clave: student123)
* Al hacer clic sobre cualquier tarjeta de usuario, los campos de DNI y Contraseña en el formulario se rellenan automáticamente.

### Gestión de Usuarios del Administrador (`admin/users`)
* **Pestañas y Creación Específica:** En la sección [page.tsx (users)](file:///C:/Users/operador/Desktop/Sistema-Educativo/weekly-courses/app/%28dashboard%29/admin/users/page.tsx) se implementó una interfaz de pestañas separadas para Estudiantes, Docentes y Administradores.
* Se incorporaron tres botones de acción rápida e independiente en la cabecera: **"Nuevo Estudiante"**, **"Nuevo Docente"** y **"Nuevo Administrador"**, asignando automáticamente el rol correspondiente a cada caso.
* Se corrigió la lectura de estado de docentes y administradores a `tc.habilitado`, pintando los badges en verde ("Habilitado") o rojo ("Inhabilitado") de manera fiel a su estado en la base de datos.

### Panel de Cursos del Docente
* **Carga Dinámica de Materiales:** Al subir un material, si el docente selecciona *Documento PDF* o *Diapositivas PPT*, se oculta el input tradicional de texto y se muestra un selector de archivos binarios `<Input type="file" accept=".pdf,.ppt,.pptx" />`. Si selecciona *Video / Enlace Externo*, se muestra el input de texto como campo obligatorio.
* **Cuestionarios y Evaluaciones:** En el Constructor Visual de Quizzes se incorporó una fila de 4 columnas en el encabezado para definir: Nombre del Quiz, Semana (Select de 1 a 18), Puntos Totales y Peso en porcentaje.
* Ambos formularios compilan y envían sus datos en formato `FormData` hacia la API del backend.

---

## 5. Control y Mitigación de Errores

### Prevención de Advertencias en React (Inputs No Controlados)
* React arrojaba la advertencia *"A component is changing an uncontrolled input to be controlled..."* debido al valor inicial indefinido de ciertos estados cuando los modales se montaban/abrían.
* **Solución Aplicada:** Se forzó que todas las variables de estado relativas a formularios tengan una inicialización segura con cadena de texto vacía (`useState("")`). Además, en el JSX se insertó el cortocircuito fallback `|| ""` en los atributos `value` de los elementos `<Input />` y `<Textarea />` (por ejemplo: `value={materialTitle || ""}`).

### Validación Estática
* Se validó el frontend al término de cada refactorización mediante `npx tsc --noEmit`. El proyecto compila limpiamente en **código de salida 0 (cero errores)**, garantizando que el tipado estático de TypeScript y las referencias en todo el árbol de componentes del dashboard sean robustas y estén libres de errores sintácticos.

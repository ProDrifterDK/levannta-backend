
# Levannta Backend

## Instrucciones de Configuración

Sigue estos pasos para ejecutar la aplicación backend localmente:

1. Clona el repositorio o descarga el código fuente.
2. Instala las dependencias necesarias ejecutando:
   ```
   npm install
   ```
3. Ejecuta las migraciones (si aplica):
   ```
   npm run typeorm migration:run
   ```
4. Inicia el servidor de desarrollo:
   ```
   npm run start:dev
   ```
5. Accede a la API en [http://localhost:3001](http://localhost:3001).

---

## Descripción Técnica

La aplicación utiliza las siguientes decisiones técnicas:

- **Framework:** NestJS para la creación de aplicaciones backend modulares y escalables.
- **ORM:** TypeORM para la gestión de la base de datos y la definición de entidades.
- **Base de Datos:** SQLite como almacenamiento local para desarrollo.
- **Arquitectura:** Modular, con controladores, servicios y entidades separadas por funcionalidad (ej., portfolio).

---

## Ejemplos de Solicitudes

A continuación, se presentan ejemplos de cómo consumir los endpoints mediante `curl`:

1. **Obtener la lista de clientes con el máximo adelanto calculado:**
   ```bash
   curl -X GET http://localhost:3001/portfolio
   ```

2. **Subir un archivo Excel con datos de portfolio y calcular el máximo adelanto:**
   ```bash
   curl -X POST http://localhost:3001/portfolio    -H "Content-Type: multipart/form-data"    -F "file=@path_to_your_file.xlsx"
   ```

3. **Solicitar un préstamo para un cliente específico:**
   ```bash
   curl -X POST http://localhost:3001/portfolio/apply-loan    -H "Content-Type: application/json"    -d '{"clientId": "Client123", "amount": 1500}'
   ```

4. **Obtener el estado del préstamo de un cliente específico:**
   ```bash
   curl -X GET http://localhost:3001/portfolio/loan-status?clientId=Client123
   ```

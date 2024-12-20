# Proyecto: Gestión de Países Hispanohablantes - Node.js, Express y MongoDB

## Descripción

Este proyecto es una **aplicación web** que permite gestionar información de países hispanohablantes. La aplicación consume datos de la API externa [Rest Countries](https://restcountries.com/) para obtener la lista de países y filtra aquellos que tienen al español como uno de sus idiomas. Posteriormente, los datos filtrados se almacenan en una base de datos **MongoDB**. La aplicación también permite visualizar la información a través de una interfaz web y proporciona funcionalidades para agregar, editar y eliminar países.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el backend.
- **Express.js**: Framework para gestionar las rutas y middleware.
- **MongoDB**: Base de datos NoSQL para almacenar la información de los países.
- **Mongoose**: Librería ODM (Object Data Modeling) para interactuar con MongoDB.
- **EJS**: Motor de plantillas para renderizar vistas dinámicas.
- **Express EJS Layouts**: Para gestionar layouts reutilizables en las vistas.
- **Express Validator**: Para validar los datos de entrada de los formularios.
- **Axios**: Cliente HTTP para consumir la API externa.

## Funcionalidades

- **Dashboard de Países**: Muestra una tabla con la información de todos los países que tienen al español como idioma. La tabla incluye los siguientes campos:
  - Nombre oficial
  - Capital
  - Fronteras
  - Área
  - Población
  - Índice Gini
  - Zonas horarias
  - Creador (tu nombre)

- **Totales**: Muestra una fila con los totales de la población, área y el promedio del índice Gini de todos los países mostrados.

- **Agregar Nuevo País**: Permite agregar un nuevo país manualmente mediante un formulario.

- **Editar País**: Proporciona la opción de editar la información de un país existente.

- **Eliminar País**: Permite eliminar un país de la base de datos.

- **Validaciones**: Los formularios de agregar y editar países incluyen validaciones para asegurar que los datos sean correctos antes de ser almacenados.

## Estructura del Proyecto

El proyecto sigue una estructura organizada para facilitar su desarrollo y mantenimiento:


## Requisitos

Para ejecutar este proyecto necesitas tener instalado lo siguiente:

- **Node.js** (versión 16 o superior).
- **MongoDB** (o utilizar un servicio en la nube como [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

## Instalación

1. Clona este repositorio en tu máquina local:


git clone <URL_DEL_REPOSITORIO>
cd <nombre_del_repositorio>
Instala las dependencias utilizando npm:
```bash

npm install 
Configura tu base de datos MongoDB.
Si estás utilizando MongoDB localmente, asegúrate de que el servicio esté corriendo.
Si usas MongoDB Atlas, configura la URL de conexión en el archivo .env.

Inicia la aplicación:

npm app.mjs

La aplicación estará disponible en http://localhost:3000.

Implementación de Validaciones
Campos a Validar
Nombre oficial (name.official): Debe tener entre 3 y 90 caracteres.
Capital (capital): Cada elemento del array debe tener entre 3 y 90 caracteres.
Fronteras (borders): Cada código de país debe ser una cadena de 3 letras mayúsculas.
Área (area): Debe ser un número positivo.
Población (population): Debe ser un número entero positivo.
Índice Gini (gini): Debe ser un número entre 0 y 100.
Si alguna validación falla, se muestra un mensaje de error claro al usuario y los datos no se guardan.

Instrucciones para el Desarrollo
Configuración Inicial:

Inicializa un proyecto Node.js y configura un servidor Express.
Instala las dependencias necesarias: axios, ejs, express, mongoose, express-ejs-layouts, express-validator, y method-override.
Consumo de la API:

Utiliza Axios para consumir la API de Rest Countries.
Filtra los países que tienen el idioma "Spanish" y procesa los datos eliminando las propiedades innecesarias.
Base de Datos:

Utiliza Mongoose para definir el esquema de los países y almacenar los datos procesados en MongoDB.
Rutas y Controladores:

Implementa las rutas necesarias para listar, agregar, editar y eliminar países.
Añade las validaciones correspondientes a los formularios utilizando express-validator.
Interfaz de Usuario:

Desarrolla las vistas usando EJS y el motor express-ejs-layouts para manejar un layout común en todas las páginas.
Crea una tabla en el dashboard para mostrar la información de los países.

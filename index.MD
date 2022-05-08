# Práctica 11: Cliente y servidor para una aplicación de procesamiento de notas de texto (semana del 2 al 8 de mayo)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101346908/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101346908?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101346908&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101346908)
[![Test](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101346908/actions/workflows/test.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101346908/actions/workflows/test.js.yml)


## Objetivos
  - Ejercicios
    1. Servidor NotesApp
    2. Cliente NotesApp
  
  - Documentacion
    - TypeDoc
    - Pruebas Mocha Chai del Servidor

## Planteamiento y Solucion:

  - Se recomienda para una correcta visualizacion de la ejecucion del servidor definir un objeto `NotesServer` con puerto `60300` al final del fichero server.ts para ejecutarlo posteriormente con NODE.
  - Como el cliente hace uso de yargs, no existe este problema.

### Servidor NotesApp
  - Se pide implementar un servidor que haciendo uso de la aplicacion ya creada en la P9 permita recibir peticiones de clientes y este las procese haciendo uso de la aplicacion de notas y generando mensajes de respuesta a las peticiones de los clientes.
  - Para mantener los tipos de las peticiones y de las respuestas se va ha emplear dos tipos `ResponseType` y `RequestType`:
    - `RequestType`:
      - **type**: Tipo de operacion.
      - **user?**: Usuario de la aplicacion de notas.
      - **title?**: Titulo de la nota.
      - **body?**: Cuerpo de la nota.
      - **color?**: Color soportado por notesAPP (`notesColors` enum).
    - `ResponseType`:
      - **type**: Tipo de operacion procesada en el servidor.
      - **success**: Booleano para hacer conocer al cliente de una ejecucion exitosa.
      - **message**: Mensaje resultante de la ejecucion exitosa de la peticion.
      - **err?**: Mensajes resultante de una ejecucion no exitosa o con errores.
      - **notes?**: Nota obtenida de una peticion read o de multiples notas de una peticion list.
  - Se ha decidido mantener casi intacta la clase de la aplicacion de notas y utilizar unicamente el metodo `spawn` para invocar el programa de notas. Esto implica tener que cambiar los `console.log()` previos por `process.stdout.write()` y ` process.stderr.write()` respectivamente para pasar los mensajes de estado al servidor por el `stream` del proceso.
  - Para las operaciones de `read` y `list` se ha tenido que tomar el mismo `stream` de salida del programa para obtener los objetos NoteClass para poder mandarlos al cliente. Se ha decidido introducir directamente con `JSON.stringify(nota)` y luego filtrarlo con `commandOutput.substring(commandOutput.search('{'), commandOutput.search('}')+1)` para rescatar el objeto mezclado con los mensajes de estado y `commandOutput.replace(commandOutput.substring(commandOutput.search('{'), commandOutput.search('}')+1),'')` para eliminarlo del mensaje, ya que este se manda al cliente y debe tener solo los mensajes de estado.
  - Para lograr que los mensajes se manden y reciban adecudamente se ha decidido crear una clase auxiliar `CommandEventEmitterServer`. El proposito de esta es generar un evento request cuando se reciba una peticion completa (terminada en '\n').
  - Toda el procesamiento del servidor se realiza en el constructor donde se crea el servidor y se pasa el `net.socket` de ese servidor al `CommandEventEmitterServer` para poder, gracias a los callbacks, procesar las peticiones.
  - Cuando el servidor recibe una peticion completa (se dispara el evento request), este mediante un switch, comprueba el tipo de la peticion, ya sea add, modify, delete, read, list, end. Todos los tipos de peticiones menos la end generan un proceso hijo:
    - Add: Invoca a la aplicacion de notas con los valores de la peticion de tipo `add` (user, title, body, color), el proceso hijo retornara por salida estandar los mensajes de estado correctos y en caso de fallo, retornara por salida de errores los mensajes de estado de fallo. Como el programa solo devuelve mensajes y no se quiere añadir mas logica en la aplicacion se ha aprovechado que el ultimo mensaje siempre representa una ejecucion satisfactoria o fallida para utilizar un booleano para saber el resultado. Cuando se produce el evento de cierre del proceso hijo se genera una respuesta completamente exitosa cuando el string de error esta vacio o en caso contrario, una respuesta de ejecucion parcial donde se pasa al cliente los mensajes de error.
    - Modify: Misma filosofia que el `Add` salvo que la operacion a ejecutar es modify.
    - Delete: Misma filosofia que el `Add` salvo que solo se hace uso del nombre de usuario y el titulo de la nota y la operacion a ejecutar es la de borrado.
    - Read: Procesamiento identico al resto salvo que en este caso como se debe devolver al usuario un objeto NoteClass es necesario obtener del proceso hijo noteApp el objeto en si, para esto se ha decidido aprovechar el stream para introducir el objeto en formato string y en el servidor, filtrarlo utilizando los (`{`, `}`) como delimitadores para obtenerlos. Una vez filtrado se elimina ya que es necesario tener el mensaje limpio para pasarlo al cliente.
    - List: Mismo planteamiento que el `Read` salvo que ahora se puede dar el caso de multiples notas por lo que es necesario repetir multiples veces el filtrado ( while (commandOutput.search('{') !== -1) '{' ya que va a pares) hasta no encontrar mas notas.
    - End: Tipo de peticion en el cual se solicita cerrar la comunicacion con el cliente, significando una correcta recepcion de un mensaje previo.
  - Por último se define una funcion `close` la cual simplemente cierra el servidor bajo demanda (realizacion de pruebas).
  

### Cliente NotesApp

  - El cliente debe poder realizar peticiones del mismo estilo que en la aplicacion standalone notesApp, para ello, se utilizan los dos types (`ResponseType` y `RequestType`) que se implementan en el servidor y se incluye la clase `NoteClass` para invocar su metodo print que muestra la nota con su respectivo color utilizando `chalk`.
  - Para lograr que los mensajes se manden y reciban adecudamente se ha decidido crear una clase auxiliar `MessageEventEmitterClient`. El proposito de esta es generar un evento message cuando se reciba una respuesta completa (terminada en '\n').
  - Toda el procesamiento del cliente se realiza en el constructor donde se crea el socket de conexion con el servidor y este se pasa al `MessageEventEmitterClient` para poder, gracias a los callbacks, procesar las respuestas.
  - Cuando se invoca al constructor de cliente es obligatorio pasarle un tipo RequestType y el puerto al que se va a conectar para realizar la peticion.
  - Cuando el cliente recibe una respuesta completa (se dispara el evento message), este comprueba si se trata de una peticion satisfactoria o no satisfactoria, en caso de serlo mediante un switch, comprueba el tipo de la respuesta, ya sea add, modify, delete, read, list. (En todos se comprueba si el tipo de respuesta es la esperada segun la peticion):
    - Add: De forma muy simple, se muestra por pantalla utilizando el color verde la respuesta del servidor (ejecucion de notesAPP) satisfactoria y se manda una peticion al servidor de cierre de conexion.
    - Modify: Mismo planteamiento que `Add`.
    - Delete: Mismo planteamiento que `Add`.
    - Read: Se sigue procesando lo mismo que el resto de peticiones salvo que ahora al ser una peticion de lectura se espera una nota en la respuesta por lo que se define una nueva nota con los valores obtenidos en el mensaje y se muestra por pantalla con su color utilizando el metodo `print` de la propia nota.
    - List: Misma filosofia que read salvo que ahora no es una sola nota, posiblemente son multiples, por lo que se recorre el vector de notas de la respuesta y se va acumulando las cadenas del `print` para mostrarlo posteriormente por pantalla.
  - En caso de que se trate de una respuesta de ejecucion no exitosa:
    - Se muestra por pantalla los mensajes de estado satisfactorio que ha generado el sistema de notas en color verde.
    - Se muestra por pantalla lo que ha ido mal, en color rojo.
    - Se crea una peticion de cierre de la conexion al servidor.
  - Una vez se ha cerrado la conexion del lado del servidor, en el cliente haciendo uso del evento `end` en un callback, se muestra la confirmacion del cierre de la conexion por parte del servidor,
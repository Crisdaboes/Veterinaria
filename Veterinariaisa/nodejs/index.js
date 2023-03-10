const http = require('node:http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

let recursos = {
  mascotas: [
    {tipo: "perro", nombre: "Dante", dueno: "Cristian"},
    {tipo: "perro", nombre: "Dante", dueno: "Cristian"},
    {tipo: "perro", nombre: "Dante", dueno: "Cristian"},
    {tipo: "perro", nombre: "Dante", dueno: "Cristian"},
  ]
}


const callbackDelServidor = (req, res) => {
  // 1. Obtener url desde el objeto request
    const urlActual = req.url;
    const urlParseada = url.parse(urlActual, true);
    console.log({urlActual,urlParseada});
    // 2. obtener la ruta
    const ruta = urlParseada.pathname;
    
    // 3.Quitar el slash a la ruta
    const rutaLimpia = ruta.replace(/^\/+|\/+$/g, '');

    // 3.1 obtener el metodo http
    const metodo = req.method.toLowerCase();

    // 3.2 obtener variables del query url
    
    const {query = {}} = urlParseada;

   

    // 3.3 obtener headers 
    const {headers = {} } = req;

    // 3.4 obtener payload en el caso de haber uno
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    // 3.4.1. ir acumulando la data cuando el request reciba un payload

    req.on('data', (data)=>{
      buffer += decoder.write(data);
    });

    // 3.4.2. terminar de acumular datos y decirle al decoder que finalice

    req.on('end', ()=>{
      buffer += decoder.end();

      if(headers["content-type"] === 'application/json'){
        buffer = JSON.parse(buffer);
      }

      // 3.5 ordenar los datos del request
      const data = {
        ruta: rutaLimpia,
        query,
        metodo,
        headers,
        payload: buffer,
      };

      console.log({ data });

      // 3.6 elegir el manejador dependiendo de la ruta y asignarle la funcion que el enrutador tiene //handler
      let handler; 
      if(rutaLimpia && enrutador[rutaLimpia] && enrutador[rutaLimpia][metodo]) {
        handler = enrutador[rutaLimpia][metodo]; 
      } else{
        handler = enrutador.noEncontrado;
      }

      // 4. ejecutar handler (manejador) para enviar la respuesta
      if(typeof handler === 'function'){
        handler(data, (statusCode = 200, mensaje)=>{
          const respuesta = JSON.stringify(mensaje);
          res.setHeader("Content-Type", "application/json")
          res.writeHead(statusCode);
          // linea donde realmente ya estamos respondiendo a la aplicacion cliente
          res.end(respuesta);

        })
      }
  }); 
};
// Mensaje obtenido por cada ruta
const enrutador = {
  ruta:(data,callback) => {
    callback(200, {mensaje: 'esta es la /ruta'})
  },

  mascotas: {
    get: (data, callback) => {
      callback(200, recursos.mascotas);
    },
    post: (data, callback) => {
      recursos.mascotas.push(data.payload);
      callback(201, recursos.mascotas);
    },
    
  },
  // Create Read Update Delete Listar CRUDL
  
  
  noEncontrado: (data, callback) => {
    callback(404, {mensaje: 'no encontrado'});
  }
    
}

const server = http.createServer(callbackDelServidor);

server.listen(5000, () => {
  console.log('el servidor esta escuchando peticiones en http://localhost:5000');
});
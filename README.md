Si hago un link a http://localhost:8080/ => va a /login

Si no esta registrado => ir a /register
    -Al completar el formulario se crea el user con password hasheada y se guarda en MongoDB
    -Luego redirije a Loguin con email y contraseña (con opción a restablecer contraseña) o con Github
    -Una vez logueado se inicia session => va a vista de todos los productos con saludo de bienvenida al usuario y opción de Logout
    -/profile muestra una vista con los datos del user logueado correctamente

Para hasheo de password uso bvrypt y para atenticacion y autorización uso Passport y passport-local

/chat => permite relizar un chat para el usuario ingresando el nombre

/realtimeProductos => permite ver el post de productos desde Postman en tiempo real

Products con POSTMAN:
GET/api/products    (veo la lista de productos)
POST/api/products   (cargo un nuevo producto MongoDB con autogeneraciónn de _id)
PUT/api/products/:pid    (actualizo el producto por id)
DEL/api/products/:pid    (elimino el producto por id)

Carts con POSTMAN:
GET/api/carts       (veo la lista de carts y los productos en cada cart)
POST/api/carts      (creo un nuevo cart en MongoDB con autogeneraciónn de _id)
POST/api/carts/.cid/product/:pid      (cargo un producto al cart y lo guardo en MongoDB)
PUT/api/carts/:cid    (actualizo el cart por id seleccionado)
PUT/api/carts/.cid/product/:pid      (actualiza un producto al cart y lo guardo en MongoDB)
DEL/api/carts/:cid    (elimino el cart por id seleccionado)
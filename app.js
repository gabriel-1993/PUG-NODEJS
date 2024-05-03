// SERVIDOR 

const express = require('express');
const app = express();

// Configura Pug como motor de vistas
app.set('view engine', 'pug');
// AVERIGUAR ESTE APP SET PARA QUE ES
app.set('views', './views');


// Middleware para servir archivos estáticos (CSS,JS(cliente))
app.use(express.static('public'));


// Ruta para la página principal
app.get('/', (req, res) => {
    // funcion que lee y trae las Noticias del archivo punto5
    const noticias = readNoticiasFromFile();
    res.render('index', {
        title: 'WEB II - TP7',
        // PUNTO3
        profesiones,
        provincias,
        localidades,
        // PUNTO 4
        zoologico,
        //PUNTO 5
        noticias
    });
});



// CONSIGNA 3

// Definir datos de ejemplo
const profesiones = ['Front', 'Back', 'FullStack'];
const provincias = ['Buenos Aires', 'San Luis', 'Chaco'];
const localidades = ['La Plata', 'La Punta', 'Resistencia'];

// Ruta para renderizar la plantilla Pug
app.get('/punto3', (req, res) => {
    res.render('punto3', {
        profesiones,
        provincias,
        localidades
    });
});

// CONSIGNA 4

//Datos animales

let zoologico = [
{animal:'Perro', color:'#234421', tienePelo: true, tiene4Patas: true}, 
{animal:'Loro', color:'#00ff23', tienePelo: false, tiene4Patas: false},
{animal:'Gato',color:'#ffa500', tienePelo:true, tiene4Patas:true},
{animal:'Elefante',color:'#808080',tienePelo:false,tiene4Patas:true}

]

// Ruta para renderizar la plantilla Pug punto4
app.get('/punto4', (req, res) => {
    res.render('punto4', {
       zoologico
    });
});


// CONSIGNA 5
// Middleware para parsear el cuerpo de las solicitudes POST
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');




// Ruta principal: Muestra todas las noticias con imágenes
app.get('/noticias', (req, res) => {
    const noticias = readNoticiasFromFile();
    res.render('punto5', {noticias});
});

// Ruta para mostrar formulario de inserción de noticias
app.get('/noticias/punto5Insertar', (req, res) => {
    const categorias = readCategoriasFromFile();
    res.render('punto5Insertar', { categorias });
});



// Ruta para agregar una nueva noticia
// Ruta para agregar una nueva noticia
app.post('/noticias/agregar', (req, res) => {
    const { titulo, descripcion, categoria, fecha, url_imagen } = req.body;
    const nuevaNoticia = {
        titulo,
        descripcion,
        categoria,
        fecha,
        url_imagen
    };

    try {
        const noticias = readNoticiasFromFile();
        noticias.push(nuevaNoticia);
        saveNoticiasToFile(noticias);
        res.redirect('/noticias');
    } catch (error) {
        console.error('Error al agregar noticia:', error);
        res.status(500).send('Error interno al agregar la noticia');
    }
});

// Ruta para borrar una noticia
app.post('/noticias/borrar', (req, res) => {
    const index = req.body.index;
    const noticias = readNoticiasFromFile();
    noticias.splice(index, 1); // Elimina la noticia en el índice especificado
    saveNoticiasToFile(noticias);
    res.redirect('/noticias');
});

// Función para leer noticias desde el archivoJSON
function readNoticiasFromFile() {
    try {
        const noticiasData = fs.readFileSync('noticias.json', 'utf8');
        const noticias = JSON.parse(noticiasData);
        return noticias;
    } catch (error) {
        console.error('Error al leer noticias:', error);
        return [];
    }
}

// Función para guardar noticias en el archivo
function saveNoticiasToFile(noticias) {
    try {
        const data = JSON.stringify(noticias, null, 2);
        fs.writeFileSync('noticias.json', data);
        console.log('Noticias guardadas correctamente.');
    } catch (error) {
        console.error('Error al guardar noticias:', error);
    }
}

// Función para leer categorías desde el archivo
function readCategoriasFromFile() {
    try {
        const categoriasData = fs.readFileSync('categorias.json', 'utf8');
        const categorias = JSON.parse(categoriasData);
        return categorias;
    } catch (error) {
        console.error('Error al leer categorías:', error);
        return [];
    }
}




// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
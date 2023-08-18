require('dotenv').config();

const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const nequi = process.env.nequi
const bancolombia = process.env.bancolombia
const daviplata = process.env.daviplata
const davivienda = process.env.davivienda
const dale = process.env.dale
const bogota = process.env.bogota
const movii = process.env.movii


const flowCierre1 = addKeyword(['']).addAnswer('');

const flowContactoHumano = addKeyword(['ayuda', 'soporte', 'comunicarse con un humano', 'jose', '5']).addAnswer(
    'Si necesitas asistencia adicional, por favor indícanos tu requerimiento y en breve alguien estará contigo para brindarte ayuda. 💬'
    , null, null, [flowCierre1]);

const flowAgradecimiento = addKeyword(['ok', 'gracias', 'muchas gracias', 'ahorita paso', 'ya paso', '👍']).addAnswer(
    'Estoy aquí para ayudarte. Si tienes alguna otra pregunta, no dudes en preguntar.  😊', null, null, [flowCierre1]
);

const flowRetiro = addKeyword(['re', 'retiro', 'retirar', '1', 'reti', 'nequi']).addAnswer(
    [
        '💵 A continuación encontrarás la información de las cuentas bancarias disponibles:',
        '',
        '🔸Nequi: '.concat(nequi),
        '',
        '🔸Movii: '.concat(movii),
        '',
        '🔸Dale: '.concat(dale),
        '',
        '🔸Daviplata: '.concat(daviplata), 
        '',
        '🔸Davivienda Ahorros: '.concat(davivienda),
        '',
        '🔸Bancolombia Ahorros: '.concat(bancolombia),
        '',
        '🔸Banco Bogota Ahorros: '.concat(bogota),            
    ]).addAnswer(
    [
        'Recuerde que los retiros tienen un costo de mil pesos por cada 100 mil',
        'Por favor, asegúrate de adjuntar el comprobante al realizar la transacción.📤'
    ], null,null, [flowAgradecimiento]);


 /*   const flowConsignacion = addKeyword(['consiganar', 'consig', 'consignacion', '2', 'consignar']).addAnswer(
        [
            '🪙 Aceptamos consignaciones en los siguientes bancos:',
            '',
            '🔸Nequi',
            '🔸Bancolombia',
            '🔸Daviplata',
            '🔸Davivienda',
            '🔸Falabella',
            '🔸Bancos Grupo Aval',
        ]
    ).addAnswer([
        'Recuerde que las consignaciones tienen un costo de mil pesos por cada 100mil',
    ]).addAnswer(null, async ( { flowDynamic }) => {
            const data = await Api_noti()
            flowDynamic(data)
            console.log(data)
    }, [flowAgradecimiento]);*/

const flowConsignacion = addKeyword(['consiganar', 'consig', 'consignacion', '2', 'consignar']).addAnswer(
        [
            '🪙 Aceptamos consignaciones en los siguientes bancos:',
            '',
            '🔸Nequi',
            '🔸Bancolombia',
            '🔸Daviplata',
            '🔸Davivienda',
            '🔸Falabella',
            '🔸Bancos Grupo Aval',
        ]
    ).addAnswer([
        'Recuerde que las consignaciones tienen un costo de mil pesos por cada 100mil',
    ]).addAnswer('En este momento todas las consignaciones funcionan con normalidad ✅', null, null, [flowAgradecimiento]);


const flowImpresiones = addKeyword(['impre', 'impresiones', 'copias', 'imprimir', 'imprimen', 'impresion', '3']).addAnswer(
    [
        '🖨 En Celupartes de la Costa, ofrecemos servicios de impresión. Puedes enviar lo que desees imprimir a través de este WhatsApp o al siguiente correo electrónico: celupartesdelacosta@gmail.com.',
    ]).addAnswer([
        'Por favor, indícanos si deseas imprimir en blanco y negro o a color.',
        'En caso de ser imágenes, por favor, especifíca el tamaño.'

    ]).addAnswer([
        'A continuación, te proporcionamos nuestros precios:',
        '',
        'Impresiones en Blanco y Negro: 400 pesos por página.',
        'Impresiones en Color: 1500 pesos por página.',
        'Copias: 200 por página.'
    ], null, null, [flowAgradecimiento]);

const flowHorario = addKeyword(['horario', 'hora', 'a que hora cierran', '4']).addAnswer(
    [ '🕰 Nuestros horarios de atención son:',
    '',
    'Lunes: 8:30 am a 8:30 pm🕤',
    'Martes: 8:30 am a 8:30 pm🕤',
    'Miércoles: 8:30 am a 8:30 pm🕤',
    'Jueves: 8:30 am a 8:30 pm🕤',
    'Viernes: 8:30 am a 8:30 pm🕤',
    'Sábado: 9:00 am a 3:00 pm🕑',
    'Domingo: 10:30 am a 2:00 pm🕐',
    'Festivos: 10:30 am a 2:00 pm🕐'

    ], null, null, [flowAgradecimiento]);

const flowPrincipal = addKeyword(['hola','bnos dias','buenas tardes', 'buenas', 'buenos días', 'buenos dias', 'buenas noches', 'ola', 'jose', 'sofi',''])
    .addAnswer('👋  ¡Bienvenido al Chatbot de Celupartes de la Costa!')
    .addAnswer([
        'En nuestro chatbot🤖, puedes realizar las siguientes acciones:',
        '1️⃣. Realizar un retiro (Consulta las cuentas donde puedes enviar el dinero)',
        '2️⃣. Hacer una consignación (Consulta los bancos a los que puedes consignar)',
        '3️⃣. Solicitar impresiones',
        '4️⃣. Consultar horarios de atención',
        '5️⃣. Comunicarse con una persona']
        )
    .addAnswer('Por favor, selecciona la opción deseada ingresando el número correspondiente.',null,null, [flowRetiro, flowConsignacion, flowImpresiones, flowHorario, flowContactoHumano]);

    

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowContactoHumano, flowAgradecimiento])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}


main()
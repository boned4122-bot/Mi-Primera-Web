import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  Bike, 
  DollarSign, 
  Percent, 
  Calendar, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw,
  CheckCircle,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';

// Base de Datos de Motocicletas de Ejemplo con detalles e imágenes ilustrativas SVG
const MOTOS_DATABASE = [
  {
    id: 'urban-125',
    nombre: 'Veloce 125',
    categoria: 'Urbana',
    precio: 1850,
    oferta: 1699,
    imagen: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=600',
    descripcion: 'La reina de la ciudad. Ágil, económica y con un diseño moderno ideal para esquivar el tráfico diario.',
    ficha: {
      motor: '125cc - Monocilíndrico',
      potencia: '9.5 HP',
      consumo: '45 km/L',
      frenos: 'Disco delantero / Tambor trasero'
    },
    popular: true,
    promocion: '¡Casco de regalo y primer mantenimiento gratis!'
  },
  {
    id: 'sport-300',
    nombre: 'Apex R-300',
    categoria: 'Deportiva',
    precio: 4200,
    oferta: null,
    imagen: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Siente la adrenalina en carretera. Potencia pura con un carenado aerodinámico de última generación.',
    ficha: {
      motor: '292cc - Refrigerado por líquido',
      potencia: '28 HP',
      consumo: '30 km/L',
      frenos: 'ABS de doble canal - Doble disco'
    },
    popular: true,
    promocion: '10% de descuento en equipamiento de protección premium.'
  },
  {
    id: 'scooter-150',
    nombre: 'Breeze 150',
    categoria: 'Scooter',
    precio: 2100,
    oferta: 1950,
    imagen: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Comodidad automatizada. Espacioso maletero bajo el asiento, ideal para ir al trabajo o la universidad.',
    ficha: {
      motor: '149.5cc - Automática CVT',
      potencia: '11.2 HP',
      consumo: '38 km/L',
      frenos: 'Disco en ambas ruedas'
    },
    popular: false,
    promocion: 'Matrícula gratis este mes.'
  },
  {
    id: 'adventure-500',
    nombre: 'Terra X-500',
    categoria: 'Adventure / Trail',
    precio: 6800,
    oferta: 6399,
    imagen: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Sin límites. Diseñada para largas distancias en asfalto y terrenos difíciles gracias a su suspensión reforzada.',
    ficha: {
      motor: '471cc - Bicilíndrico en paralelo',
      potencia: '47 HP',
      consumo: '26 km/L',
      frenos: 'ABS desconectable - Doble disco delantero'
    },
    popular: true,
    promocion: 'Maletas laterales de aluminio incluidas (Ahorro de $450).'
  },
  {
    id: 'cruiser-250',
    nombre: 'heritage 250',
    categoria: 'Cruiser',
    precio: 3500,
    oferta: null,
    imagen: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600',
    descripcion: 'Estilo clásico con tecnología moderna. Posición de manejo relajada con torque de sobra para disfrutar el viaje.',
    ficha: {
      motor: '249cc - Bicilíndrico en V',
      potencia: '19 HP',
      consumo: '32 km/L',
      frenos: 'Disco delantero / Tambor trasero'
    },
    popular: false,
    promocion: 'Financiación con tasa preferencial del 0% de interés de entrada.'
  }
];

export default function App() {
  // --- ESTADOS ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '¡Hola! 🏍️ Bienvenido a MotoBot, tu asesor experto de ventas de motocicletas. Estoy aquí para ayudarte a encontrar la moto de tus sueños.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 2,
      sender: 'bot',
      text: '¿Cómo te gustaría empezar hoy? Puedes ver nuestro catálogo, revisar las ofertas imperdibles o simular un plan de pagos a cuotas.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        { label: '🏍️ Ver Catálogo de Motos', value: 'ver_catalogo' },
        { label: '🔥 Ver Promociones y Ofertas', value: 'ver_ofertas' },
        { label: '💰 Calcular Plan de Cuotas', value: 'simular_credito' },
        { label: '❓ Recomiéndame una Moto', value: 'test_recomendacion' }
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('motos'); // 'motos' | 'simulador' | 'promociones'
  const [selectedMoto, setSelectedMoto] = useState(MOTOS_DATABASE[0]);
  
  // Filtros catálogo
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  // Simulador de Crédito
  const [cuotaInicialPct, setCuotaInicialPct] = useState(20); // Porcentaje de inicial (mínimo 10%)
  const [plazoMeses, setPlazoMeses] = useState(24); // 12, 18, 24, 36
  const [tasaInteresAnual, setTasaInteresAnual] = useState(15); // 15% Tasa de interés referencial anual

  // Flujo del cuestionario de recomendación guiada
  const [quizStep, setQuizStep] = useState(0); // 0 = no quiz, 1 = uso principal, 2 = presupuesto, 3 = resultado
  const [quizAnswers, setQuizAnswers] = useState({ uso: '', presupuesto: 0 });

  const chatEndRef = useRef(null);

  // Auto Scroll del Chat al recibir/enviar mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- LOGICA DE CRÉDITO ---
  const calcularFinanciamiento = (moto) => {
    if (!moto) return { precioBase: 0, inicial: 0, financiar: 0, cuotaMensual: 0, totalPagar: 0 };
    const precioBase = moto.oferta ? moto.oferta : moto.precio;
    const inicial = Math.round(precioBase * (cuotaInicialPct / 100));
    const financiar = precioBase - inicial;
    
    // Fórmula de cuota constante (Amortización Francesa)
    // Tasa mensual = Tasa anual / 12 / 100
    const r = (tasaInteresAnual / 12) / 100;
    const n = plazoMeses;
    
    let cuotaMensual = 0;
    if (r > 0) {
      cuotaMensual = (financiar * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      cuotaMensual = financiar / n;
    }
    
    const totalPagar = inicial + (cuotaMensual * n);
    return {
      precioBase,
      inicial,
      financiar,
      cuotaMensual: Math.round(cuotaMensual),
      totalPagar: Math.round(totalPagar),
      interesTotal: Math.round(totalPagar - precioBase)
    };
  };

  const sim = calcularFinanciamiento(selectedMoto);

  // --- GESTIÓN DE RESPUESTAS AUTOMÁTICAS ---
  const procesarMensajeUsuario = (texto, valorClave = '') => {
    const textoNormalizado = texto.toLowerCase().trim();
    let respuestaBot = '';
    let nuevasSugerencias = [];
    let cambioPestana = null;

    // Si viene de un botón de sugerencia rápida
    if (valorClave) {
      if (valorClave === 'ver_catalogo') {
        respuestaBot = '¡Excelente elección! Aquí tienes nuestro catálogo de motos disponibles. Contamos con modelos Urbanos, Deportivos, de Aventura y Scooters adaptados a tu estilo de vida. Puedes filtrarlos en el panel lateral.';
        nuevasSugerencias = [
          { label: '🔥 Ver Ofertas del Mes', value: 'ver_ofertas' },
          { label: '💰 Ver Cuotas de una Moto', value: 'simular_credito' },
          { label: '🏍️ Consultar por Apex R-300', value: 'info_apex' }
        ];
        cambioPestana = 'motos';
      } 
      else if (valorClave === 'ver_ofertas') {
        respuestaBot = '¡Tenemos las mejores promociones de la temporada! 🔥 Actualmente, varios de nuestros modelos cuentan con precios rebajados de locura y obsequios de fábrica (Cascos certificados, mantenimientos gratuitos o kits de maletas).';
        nuevasSugerencias = [
          { label: '🏍️ Ver Veloce 125 en Oferta', value: 'info_veloce' },
          { label: '🏕️ Ver Terra X-500 en Oferta', value: 'info_terra' },
          { label: '💰 Simular Financiamiento', value: 'simular_credito' }
        ];
        cambioPestana = 'promociones';
      } 
      else if (valorClave === 'simular_credito') {
        respuestaBot = `¡Estupendo! Analicemos tus cuotas para la **${selectedMoto.nombre}**. El precio de esta moto es de $${selectedMoto.oferta || selectedMoto.precio} USD.\n\nHe activado el simulador en el panel lateral para ti. Puedes personalizar tu porcentaje de Cuota Inicial y los Meses de Plazo para adaptarlo a tu bolsillo.`;
        nuevasSugerencias = [
          { label: '🏍️ Cambiar de Motocicleta', value: 'ver_catalogo' },
          { label: '📈 Ver Ficha Técnica de esta moto', value: 'ver_ficha' },
          { label: '📞 Solicitar aprobación de Crédito', value: 'solicitar_credito' }
        ];
        cambioPestana = 'simulador';
      } 
      else if (valorClave === 'test_recomendacion') {
        setQuizStep(1);
        respuestaBot = '¡Me encanta ayudarte a elegir tu moto ideal! 🧭 Para darte la mejor recomendación, respóndeme esta primera pregunta:\n\n**¿Para qué usarás principalmente la moto?**';
        nuevasSugerencias = [
          { label: '🌆 Diario en la Ciudad / Ir a trabajar o estudiar', value: 'quiz_ciudad' },
          { label: '🛣️ Viajes Largos / Fines de Semana en Carretera', value: 'quiz_viajes' },
          { label: '⚡ Sentir velocidad / Estilo Deportivo', value: 'quiz_deporte' }
        ];
      }
      // Respuestas específicas del Quiz
      else if (valorClave.startsWith('quiz_')) {
        const respuestaUso = valorClave.replace('quiz_', '');
        setQuizAnswers(prev => ({ ...prev, uso: respuestaUso }));
        setQuizStep(2);
        respuestaBot = '¡Entendido! Ese uso define perfectamente la cilindrada que necesitas. Ahora, cuéntame sobre tu presupuesto aproximado de compra:';
        nuevasSugerencias = [
          { label: '💵 Presupuesto Ajustado (Menos de $2,500 USD)', value: 'presup_bajo' },
          { label: '💳 Presupuesto Medio ($2,500 - $4,500 USD)', value: 'presup_medio' },
          { label: '🏆 Busco lo mejor sin importar el costo (+ $4,500 USD)', value: 'presup_alto' }
        ];
      }
      else if (valorClave.startsWith('presup_')) {
        const pLevel = valorClave.replace('presup_', '');
        let motoRecomendada = MOTOS_DATABASE[0]; // default

        if (quizAnswers.uso === 'ciudad') {
          if (pLevel === 'bajo') motoRecomendada = MOTOS_DATABASE.find(m => m.id === 'urban-125') || MOTOS_DATABASE[0];
          else motoRecomendada = MOTOS_DATABASE.find(m => m.id === 'scooter-150') || MOTOS_DATABASE[0];
        } else if (quizAnswers.uso === 'viajes') {
          if (pLevel === 'alto') motoRecomendada = MOTOS_DATABASE.find(m => m.id === 'adventure-500') || MOTOS_DATABASE[3];
          else motoRecomendada = MOTOS_DATABASE.find(m => m.id === 'cruiser-250') || MOTOS_DATABASE[4];
        } else {
          // Deporte
          motoRecomendada = MOTOS_DATABASE.find(m => m.id === 'sport-300') || MOTOS_DATABASE[1];
        }

        setSelectedMoto(motoRecomendada);
        setQuizStep(3);
        respuestaBot = `¡Basado en tus preferencias, tu compañera ideal de rutas es la **${motoRecomendada.nombre}**! 🎉\n\n**¿Por qué es perfecta para ti?**\n${motoRecomendada.descripcion}\n\nTiene un precio de **$${motoRecomendada.oferta || motoRecomendada.precio} USD** y te ofrece un rendimiento increíble de **${motoRecomendada.ficha.consumo}**.\n\n¿Te gustaría ver su plan de cuotas?`;
        nuevasSugerencias = [
          { label: '💰 Sí, calcular cuotas de esta moto', value: 'simular_credito' },
          { label: '🗺️ Mostrar Ficha Técnica completa', value: 'ver_ficha' },
          { label: '🔄 Volver a intentar cuestionario', value: 'test_recomendacion' }
        ];
        cambioPestana = 'motos';
      }
      // Respuestas para motos rápidas
      else if (valorClave === 'info_veloce') {
        const m = MOTOS_DATABASE.find(x => x.id === 'urban-125');
        setSelectedMoto(m);
        respuestaBot = `La **${m.nombre}** está de locura. Es sumamente económica y tiene un descuento activo de $151 dólares, quedando en solo **$${m.oferta} USD**. Además, viene con un casco homologado de regalo.`;
        nuevasSugerencias = [
          { label: '💰 Calcular cuotas de esta moto', value: 'simular_credito' },
          { label: '🏍️ Explorar otras motos', value: 'ver_catalogo' }
        ];
        cambioPestana = 'motos';
      }
      else if (valorClave === 'info_terra') {
        const m = MOTOS_DATABASE.find(x => x.id === 'adventure-500');
        setSelectedMoto(m);
        respuestaBot = `La poderosa **${m.nombre}** cuenta con un motor de ${m.ficha.motor} ideal para salir de la rutina. Viene con maletas laterales de aluminio gratis valoradas en $450 USD.`;
        nuevasSugerencias = [
          { label: '💰 Calcular cuotas de esta moto', value: 'simular_credito' },
          { label: '🏕️ Ver detalles técnicos', value: 'ver_ficha' }
        ];
        cambioPestana = 'motos';
      }
      else if (valorClave === 'info_apex') {
        const m = MOTOS_DATABASE.find(x => x.id === 'sport-300');
        setSelectedMoto(m);
        respuestaBot = `¡La deportiva **${m.nombre}** destaca por sus frenos ABS de doble canal y una potencia de ${m.ficha.potencia}! Ideal para quienes aman la velocidad de forma segura.`;
        nuevasSugerencias = [
          { label: '📊 Simular cuotas para Apex', value: 'simular_credito' },
          { label: '🔥 Ver más ofertas', value: 'ver_ofertas' }
        ];
        cambioPestana = 'motos';
      }
      else if (valorClave === 'ver_ficha') {
        respuestaBot = `Aquí tienes la ficha técnica detallada de la **${selectedMoto.nombre}**:\n\n• **Motor:** ${selectedMoto.ficha.motor}\n• **Potencia:** ${selectedMoto.ficha.potencia}\n• **Consumo:** ${selectedMoto.ficha.consumo}\n• **Sistema de Frenado:** ${selectedMoto.ficha.frenos}\n\n¿Deseas financiarla hoy?`;
        nuevasSugerencias = [
          { label: '💰 Calcular cuotas', value: 'simular_credito' },
          { label: '📞 Me interesa comprarla', value: 'solicitar_credito' }
        ];
      }
      else if (valorClave === 'solicitar_credito') {
        respuestaBot = `¡Genial decisión! La **${selectedMoto.nombre}** puede ser tuya. He agendado la simulación con una cuota mensual estimada de **$${sim.cuotaMensual} USD** por ${plazoMeses} meses.\n\nPara iniciar tu proceso de aprobación de crédito rápido, un asesor humano se pondrá en contacto contigo en los próximos 10 minutos. ¿Nos proporcionas un número de WhatsApp de contacto?`;
        nuevasSugerencias = [
          { label: '👍 Enviar mi contacto', value: 'enviar_datos' },
          { label: '💡 Seguir explorando motos', value: 'ver_catalogo' }
        ];
      }
      else if (valorClave === 'enviar_datos') {
        respuestaBot = '¡Perfecto! Tus datos han sido registrados en nuestro sistema. Uno de nuestros asesores de ventas premium te contactará ahora mismo para agendar tu test drive y validar tu línea de crédito de forma digital. 🏍️💨';
        nuevasSugerencias = [
          { label: '🏠 Volver al inicio', value: 'inicio_volver' }
        ];
      }
      else if (valorClave === 'inicio_volver') {
        respuestaBot = '¿En qué más te puedo asistir hoy en MotoBot? Estoy listo para responder dudas, ver catálogos o buscar la mejor financiación.';
        nuevasSugerencias = [
          { label: '🏍️ Ver Catálogo de Motos', value: 'ver_catalogo' },
          { label: '🔥 Ver Promociones y Ofertas', value: 'ver_ofertas' },
          { label: '💰 Calcular Plan de Cuotas', value: 'simular_credito' }
        ];
      }
    } 
    // Análisis de lenguaje natural simple si el usuario escribe directamente
    else {
      if (textoNormalizado.includes('hola') || textoNormalizado.includes('buenos') || textoNormalizado.includes('tardes')) {
        respuestaBot = '¡Hola de nuevo! Es un placer saludarte. ¿Listo para conocer nuestras motocicletas y promociones vigentes? ¿O buscas financiación?';
        nuevasSugerencias = [
          { label: '🏍️ Ver Catálogo', value: 'ver_catalogo' },
          { label: '💰 Simulador de Cuotas', value: 'simular_credito' }
        ];
      } 
      else if (textoNormalizado.includes('precio') || textoNormalizado.includes('cuesta') || textoNormalizado.includes('cuanto') || textoNormalizado.includes('valor')) {
        respuestaBot = `El catálogo de motos tiene precios desde los **$1,699 USD** (con descuento en la Veloce 125) hasta los **$6,399 USD** para la aventurera Terra X-500. ¿Hay algún modelo específico del que desees conocer la oferta o simular cuotas?`;
        nuevasSugerencias = [
          { label: '🏍️ Ver Todas las Motos', value: 'ver_catalogo' },
          { label: '🔥 Ver Ofertas', value: 'ver_ofertas' }
        ];
      } 
      else if (textoNormalizado.includes('cuota') || textoNormalizado.includes('financi') || textoNormalizado.includes('pago') || textoNormalizado.includes('credito') || textoNormalizado.includes('meses')) {
        respuestaBot = `Ofrecemos excelentes planes de crédito flexible de 12 a 36 meses, con cuotas iniciales desde el 10% del valor del vehículo. ¿Te gustaría calcular la cuota mensual exacta para la **${selectedMoto.nombre}**?`;
        nuevasSugerencias = [
          { label: '💰 Sí, calcular cuotas de esta moto', value: 'simular_credito' },
          { label: '🏍️ Cambiar de moto primero', value: 'ver_catalogo' }
        ];
      } 
      else if (textoNormalizado.includes('oferta') || textoNormalizado.includes('promo') || textoNormalizado.includes('descuento')) {
        respuestaBot = '¡Claro que sí! Contamos con promociones espectaculares como la Veloce 125 con $151 de descuento, o la Terra 500 que incluye el kit de maletas viajeras. He abierto el panel de promociones en el lateral para que los veas detallados.';
        nuevasSugerencias = [
          { label: '🔥 Ver ofertas en detalle', value: 'ver_ofertas' },
          { label: '🏍️ Volver al catálogo', value: 'ver_catalogo' }
        ];
        cambioPestana = 'promociones';
      }
      else if (textoNormalizado.match(/\b(whatsapp|telefono|celular|numero|contacto)\b/) || textoNormalizado.match(/\d{7,10}/)) {
        respuestaBot = '¡Muchas gracias! He tomado nota de tus datos de contacto. Un asesor experto se contactará contigo vía WhatsApp de inmediato para darte una atención 100% personalizada y validar tu pre-aprobación del crédito. 📲🏍️';
        nuevasSugerencias = [
          { label: '🔄 Iniciar otra consulta', value: 'inicio_volver' }
        ];
      }
      else {
        respuestaBot = 'Entiendo perfectamente. Contamos con amplia disponibilidad de inventario, planes de cuotas ajustables a tu salario y regalos por tu compra. ¿Te gustaría simular el plan de pagos de la moto seleccionada o que te recomiende un modelo?';
        nuevasSugerencias = [
          { label: '💰 Simular pagos a cuotas', value: 'simular_credito' },
          { label: '🧭 Hacer cuestionario de recomendación', value: 'test_recomendacion' }
        ];
      }
    }

    // Retrasar respuesta de bot para simular que está "escribiendo"
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: 'bot',
          text: respuestaBot,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: nuevasSugerencias.length > 0 ? nuevasSugerencias : null
        }
      ]);
      if (cambioPestana) {
        setActiveTab(cambioPestana);
      }
    }, 850);
  };

  // Enviar mensaje de texto escrito por el usuario
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const originalText = inputText;
    setInputText('');
    
    procesarMensajeUsuario(originalText);
  };

  // Al hacer click en una sugerencia de respuesta rápida
  const handleSuggestionClick = (suggestion) => {
    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: suggestion.label,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    procesarMensajeUsuario(suggestion.label, suggestion.value);
  };

  // Función para cambiar de moto en el catálogo
  const seleccionarYNotificarMoto = (moto) => {
    setSelectedMoto(moto);
    
    // Añadir mensaje del bot comentando sobre el cambio de moto
    const nuevoMsgBot = {
      id: messages.length + 1,
      sender: 'bot',
      text: `Has seleccionado la **${moto.nombre}** (${moto.categoria}). Es una excelente elección con un valor de **$${moto.oferta || moto.precio} USD**. ¿Quieres simular su plan de cuotas o ver su ficha técnica detallada?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        { label: '💰 Calcular Cuotas de esta moto', value: 'simular_credito' },
        { label: '📊 Ver Ficha Técnica Completa', value: 'ver_ficha' },
        { label: '🔥 Ver promociones disponibles', value: 'ver_ofertas' }
      ]
    };
    
    setMessages(prev => [...prev, nuevoMsgBot]);
  };

  // Filtrado de las motos
  const motosFiltradas = filtroCategoria === 'Todas' 
    ? MOTOS_DATABASE 
    : MOTOS_DATABASE.filter(m => m.categoria === filtroCategoria);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* --- HEADER --- */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-slate-950 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                MOTOBOT INTELLIGENT SALES
              </h1>
              <p className="text-xs text-slate-400 font-medium">Asesor virtual de venta, promociones y créditos de motos</p>
            </div>
          </div>
          
          {/* Indicadores de Promociones de la tienda */}
          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-full shadow-inner">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">Campañas activas: <strong className="text-amber-400">Cupos de crédito directo inmediato</strong></span>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT --- */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* === COLUMNA IZQUIERDA: EL CHATBOT (5 cols en lg) === */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden h-[600px] lg:h-[750px]">
          {/* Cabecera del chat */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-md">
                  <Bot className="w-5.5 h-5.5 text-slate-950" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
              </div>
              <div>
                <div className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                  MotoBot AI Asesor
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">VENTAS</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">En línea para cotizarte</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setMessages([
                  {
                    id: 1,
                    sender: 'bot',
                    text: '¡Asistente reiniciado! 🏍️ ¿En qué te puedo asesorar? Explora nuestro catálogo de motos urbanas, deportivas, scooter y enduro, o calcula tus cuotas de inmediato.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    suggestions: [
                      { label: '🏍️ Ver Catálogo de Motos', value: 'ver_catalogo' },
                      { label: '🔥 Ver Promociones y Ofertas', value: 'ver_ofertas' },
                      { label: '💰 Calcular Plan de Cuotas', value: 'simular_credito' }
                    ]
                  }
                ]);
                setQuizStep(0);
              }}
              title="Reiniciar chat"
              className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    
                    {/* Icono del remitente */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-amber-500 text-slate-950 font-bold text-xs' 
                        : 'bg-slate-800 text-amber-400'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Burbuja de mensaje */}
                    <div>
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                        msg.sender === 'user' 
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none' 
                          : 'bg-slate-900 text-slate-200 border border-slate-800/60 rounded-tl-none'
                      }`}>
                        {/* Render simple de Markdown en negrita */}
                        {msg.text.split('\n').map((parrafo, idx) => (
                          <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                            {parrafo.split('**').map((chunk, cIdx) => 
                              cIdx % 2 === 1 ? <strong key={cIdx} className={msg.sender === 'user' ? 'text-slate-950 font-extrabold' : 'text-amber-400 font-semibold'}>{chunk}</strong> : chunk
                            )}
                          </p>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block px-1 text-right">
                        {msg.time}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Sugerencias Rápidas de Respuestas de Bot */}
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 pl-10 pt-1">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSuggestionClick(sug)}
                        className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-1.5 text-left"
                      >
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                        {sug.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Animación de "escribiendo" */}
            <div ref={chatEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 focus-within:border-amber-500/50 transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu consulta sobre motos o cuotas..."
                className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-slate-950 p-2.5 rounded-lg font-bold transition-all duration-150 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-2.5">
              💡 Ej: "ver ofertas", "precio de Apex", "financiación a 24 meses" o envía tu número.
            </p>
          </form>

        </div>

        {/* === COLUMNA DERECHA: PANEL VISUAL INTERACTIVO (7 cols en lg) === */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-2xl overflow-hidden h-[600px] lg:h-[750px] border border-slate-800 shadow-xl">
          
          {/* Tabs Navegación del Panel */}
          <div className="bg-slate-950 border-b border-slate-800 p-2 flex gap-1">
            <button
              onClick={() => setActiveTab('motos')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'motos'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bike className="w-4 h-4" />
              Catálogo de Motos
            </button>
            <button
              onClick={() => setActiveTab('simulador')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'simulador'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Calculadora de Cuotas
            </button>
            <button
              onClick={() => setActiveTab('promociones')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'promociones'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Percent className="w-4 h-4" />
              Promos y Regalos
            </button>
          </div>

          {/* Contenedor del contenido (Scrolleable) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900 custom-scrollbar">
            
            {/* TAB 1: CATALOGO DE MOTOS */}
            {activeTab === 'motos' && (
              <div className="space-y-6">
                
                {/* Cabecera del catálogo y filtros */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-bold">Filtrar Modelos</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Todas', 'Urbana', 'Deportiva', 'Scooter', 'Adventure / Trail', 'Cruiser'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFiltroCategoria(cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          filtroCategoria === cat
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de Motos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {motosFiltradas.map((moto) => {
                    const esSeleccionada = selectedMoto?.id === moto.id;
                    return (
                      <div
                        key={moto.id}
                        className={`group rounded-xl border overflow-hidden transition-all duration-300 ${
                          esSeleccionada
                            ? 'bg-slate-950 border-amber-500 ring-1 ring-amber-500 shadow-xl'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        {/* Contenedor de la Imagen */}
                        <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                          <img
                            src={moto.imagen}
                            alt={``}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                            onError={(e) => {
                              // Fallback si la url de unsplash falla temporalmente
                              e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <div className="absolute top-2 left-2 flex gap-1.5">
                            <span className="bg-slate-950/80 backdrop-blur-sm text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20">
                              {moto.categoria}
                            </span>
                            {moto.oferta && (
                              <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">
                                OFERTA
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Información del Modelo */}
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-extrabold text-lg text-white tracking-tight">{moto.nombre}</h3>
                            <div className="text-right">
                              {moto.oferta ? (
                                <div className="flex flex-col">
                                  <span className="text-xs text-slate-500 line-through">${moto.precio}</span>
                                  <span className="text-amber-400 font-extrabold text-base">${moto.oferta} USD</span>
                                </div>
                              ) : (
                                <span className="text-slate-200 font-extrabold text-base">${moto.precio} USD</span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {moto.descripcion}
                          </p>

                          {/* Ficha técnica rápida */}
                          <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-2 rounded-lg text-[10px] text-slate-300">
                            <div>🏍️ {moto.ficha.motor}</div>
                            <div>⚡ {moto.ficha.potencia}</div>
                            <div>⛽ {moto.ficha.consumo}</div>
                            <div>🛡️ Frenado: {moto.ficha.frenos.split(' - ')[0]}</div>
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => seleccionarYNotificarMoto(moto)}
                              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                esSeleccionada
                                  ? 'bg-amber-500 text-slate-950 font-black'
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                              }`}
                            >
                              {esSeleccionada ? 'Seleccionada' : 'Seleccionar'}
                              <CheckCircle className={`w-3.5 h-3.5 ${esSeleccionada ? 'inline-block' : 'hidden'}`} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMoto(moto);
                                setActiveTab('simulador');
                              }}
                              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-2 rounded-lg text-xs font-bold border border-amber-500/20 transition-all flex items-center justify-center gap-1"
                              title="Simular financiamiento de este modelo"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              Calcular Cuotas
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 2: CALCULADORA DE CUOTAS */}
            {activeTab === 'simulador' && (
              <div className="space-y-6">
                
                {/* Moto actualmente seleccionada en la simulación */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-16 h-12 bg-slate-900 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                      <img src={selectedMoto.imagen} alt={selectedMoto.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">{selectedMoto.categoria}</span>
                      <h3 className="font-extrabold text-base text-white">{selectedMoto.nombre}</h3>
                      <p className="text-xs text-slate-400">Precio base: ${selectedMoto.oferta || selectedMoto.precio} USD</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('motos')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 rounded-lg w-full sm:w-auto justify-center hover:bg-amber-500/10"
                  >
                    Cambiar Motocicleta <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Calculador de Cuotas Deslizables */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Personaliza tu Plan de Pagos
                  </h4>

                  {/* 1. Cuota Inicial Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-slate-300">Cuota Inicial ({cuotaInicialPct}%)</span>
                      <span className="text-amber-400 font-extrabold">${sim.inicial} USD</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      step="5"
                      value={cuotaInicialPct}
                      onChange={(e) => setCuotaInicialPct(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Mínimo 10% (${Math.round((selectedMoto.oferta || selectedMoto.precio) * 0.1)})</span>
                      <span>50%</span>
                      <span>Máximo 80%</span>
                    </div>
                  </div>

                  {/* 2. Plazo de Meses */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-300 block">
                      Plazo de Financiamiento (Meses)
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {[12, 18, 24, 36].map((meses) => (
                        <button
                          key={meses}
                          onClick={() => setPlazoMeses(meses)}
                          className={`py-3.5 rounded-xl text-xs font-black transition-all border ${
                            plazoMeses === meses
                              ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {meses} Meses
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detalle de Tasa Informativa */}
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                    <Info className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Tasa de interés de financiación anual fija: <strong className="text-slate-200">{tasaInteresAnual}%</strong>. Sin cargos ocultos ni penalidades por abono a capital.</span>
                  </div>

                </div>

                {/* RESUMEN DE AMORTIZACIÓN */}
                <div className="bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl p-6 text-slate-950 shadow-xl space-y-4">
                  <h4 className="font-extrabold text-base uppercase tracking-wider text-slate-900">
                    Tu Cuota Mensual Estimada
                  </h4>
                  
                  <div className="flex items-baseline justify-between border-b border-slate-900/10 pb-4">
                    <span className="text-xs font-bold uppercase text-slate-800">Pago mensual</span>
                    <div className="text-right">
                      <span className="text-4xl font-black tracking-tight">${sim.cuotaMensual}</span>
                      <span className="text-sm font-bold text-slate-800">/mes</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm pt-2 font-semibold">
                    <div className="text-slate-800">Precio Moto:</div>
                    <div className="text-right">${sim.precioBase} USD</div>
                    
                    <div className="text-slate-800">Cuota Inicial entregada:</div>
                    <div className="text-right">${sim.inicial} USD</div>

                    <div className="text-slate-800">Total a Financiar:</div>
                    <div className="text-right">${sim.financiar} USD</div>

                    <div className="text-slate-800">Plazo Elegido:</div>
                    <div className="text-right">{plazoMeses} meses</div>

                    <div className="text-slate-900 font-bold border-t border-slate-900/10 pt-2">Total final financiado:</div>
                    <div className="text-right font-black text-lg border-t border-slate-900/10 pt-1.5">${sim.totalPagar} USD</div>
                  </div>

                  <button
                    onClick={() => {
                      // Simular envío de propuesta al chatbot
                      const mensajeSimulado = {
                        id: messages.length + 1,
                        sender: 'user',
                        text: `Solicito cotización de crédito para la ${selectedMoto.nombre} con cuota inicial de $${sim.inicial} USD a ${plazoMeses} meses.`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setMessages(prev => [...prev, mensajeSimulado]);
                      procesarMensajeUsuario('', 'solicitar_credito');
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-3 px-4 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 mt-4"
                  >
                    Aprobar Crédito Con Esta Cuota
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 3: PROMOCIONES Y REGALOS */}
            {activeTab === 'promociones' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-2">
                    <Percent className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-lg text-white">¡Promociones Exclusivas de Temporada!</h3>
                  <p className="text-xs text-slate-400 max-w-lg mx-auto">
                    Aprovecha nuestros bonos especiales de descuento directo y paquetes de accesorios de fábrica incluidos por la compra de tu moto hoy mismo.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Promo 1 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center w-full md:w-auto">
                      <div className="bg-red-500/10 text-red-400 p-3 rounded-xl shrink-0">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Bono de Descuento Especial</h4>
                        <p className="text-xs text-slate-400">Veloce 125 con un descuento directo de <strong className="text-amber-400">$151 USD</strong>.</p>
                        <span className="text-[10px] text-emerald-400 font-bold block mt-1">¡Válido hasta agotar existencias!</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const m = MOTOS_DATABASE.find(x => x.id === 'urban-125');
                        setSelectedMoto(m);
                        setActiveTab('motos');
                      }}
                      className="bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs hover:bg-amber-400 w-full md:w-auto shrink-0 transition-colors"
                    >
                      Ver Modelo
                    </button>
                  </div>

                  {/* Promo 2 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center w-full md:w-auto">
                      <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Equipamiento Premium Sin Costo</h4>
                        <p className="text-xs text-slate-400">Terra X-500 incluye el juego de <strong className="text-amber-400">Maletas Viajeras de Aluminio</strong>.</p>
                        <span className="text-[10px] text-slate-500 block mt-1">Valor comercial de las maletas: $450 USD.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const m = MOTOS_DATABASE.find(x => x.id === 'adventure-500');
                        setSelectedMoto(m);
                        setActiveTab('motos');
                      }}
                      className="bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs hover:bg-amber-400 w-full md:w-auto shrink-0 transition-colors"
                    >
                      Ver Modelo
                    </button>
                  </div>

                  {/* Promo 3 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center w-full md:w-auto">
                      <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">Tasa Preferencial de Entrada 0%</h4>
                        <p className="text-xs text-slate-400">Financia tu Heritage 250 con cuota inicial de entrada y <strong className="text-amber-400">0% de interés de entrada</strong>.</p>
                        <span className="text-[10px] text-emerald-400 font-bold block mt-1">Sujeto a pre-evaluación crediticia inmediata.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const m = MOTOS_DATABASE.find(x => x.id === 'cruiser-250');
                        setSelectedMoto(m);
                        setActiveTab('motos');
                      }}
                      className="bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs hover:bg-amber-400 w-full md:w-auto shrink-0 transition-colors"
                    >
                      Ver Modelo
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-dashed border-slate-800 text-center">
                  <h4 className="text-sm font-bold text-white mb-2">🎁 ¿Quieres que te ayudemos a elegir tu promoción?</h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Comunícaselo a MotoBot en la caja de chat de la izquierda para recomendarte una promo.
                  </p>
                  <button
                    onClick={() => {
                      const msgSimulado = {
                        id: messages.length + 1,
                        sender: 'user',
                        text: 'Quiero que me asesoren en las mejores ofertas vigentes',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setMessages(prev => [...prev, msgSimulado]);
                      procesarMensajeUsuario('', 'ver_ofertas');
                    }}
                    className="inline-flex bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/40 py-2 px-4 rounded-xl text-xs font-bold transition-all"
                  >
                    Consultar a MotoBot
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Footer del Panel Derecho */}
          <div className="bg-slate-950 border-t border-slate-800 p-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <span>Precios de referencia sugeridos para financiamientos directos del concesionario en USD.</span>
          </div>

        </div>

      </div>
      
    </div>
  );
}
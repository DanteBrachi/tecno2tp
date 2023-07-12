let obra = [];
let figuras = [];
let cantidad = 12;
let miPaleta;

let mic;

let audioContext;

let amp;
let AMP_MIN = 0.02;
let AMP_MAX = 0.2;

let frecuencia;
let FREC_MIN = 100; 
let FREC_MAX = 450; 

let altoGestor = 100;
let anchoGestor = 400;
let amortiguacion = 0.7;
let gestorAmp;

const pitchModel = "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let haySonido = false;

let habiaSonido = false;

let classifier;
const options = { probabilityThreshold: 0.7 };
let label;
let etiqueta;
let soundModel = 'https://teachablemachine.withgoogle.com/models/00XmHuFxP/';

function preload () {
  classifier = ml5.soundClassifier(soundModel + 'model.json', options);

  for (let i = 0; i < 12; i++) {
    let nombre = "data/figura" + nf (i, 2) + ".png";
    figuras [i] = loadImage (nombre);
  }

  miPaleta = new Paleta ("data/paletaobras.jpg");
}

function setup () {
  createCanvas (550, 550);

  imageMode (CENTER);

  for (let i = 0; i < cantidad; i++) {
    obra [i] = new Obra ();
  }

  classifier.classify(gotResult);

  audioContext = getAudioContext ();

  mic = new p5.AudioIn ();
  mic.start (startPitch);

  gestorAmp = new Gestor (AMP_MIN, AMP_MAX);
  gestorAmp.f = amortiguacion;

  userStartAudio ();
}

function draw () {
  background (0);

  amp = mic.getLevel ();
  gestorAmp.actualizar (amp);

  haySonido = gestorAmp.filtrada;

  haySonido = amp > AMP_MIN;
  haySonido = frecuencia > FREC_MIN;

  let empezoElSonido = haySonido && !habiaSonido;

  if (empezoElSonido) {
    for (let i = 0; i < cantidad; i++) {
      obra [i].dibujar ();
      obra [i].movimiento ();
    }
  }

  if (haySonido) {
    for (let i = 0; i < cantidad; i++) {
      obra [i].actualizarSonido (amp, frecuencia);
    }
  }

  cambiarColor();

  for (let i = 0; i < cantidad; i++) {
    obra [i].dibujar ();
    obra [i].movimiento ();
  }

  habiaSonido = haySonido;
}

function cambiarColor() {
  if (label == 'sh') {
    label = '';

    for (let i = 0; i < cantidad; i++) {
      obra[i].cambiarColores(miPaleta);
    }
  }
}

function startPitch () {
  pitch = ml5.pitchDetection (pitchModel, audioContext, mic.stream, modelLoaded);
}

function modelLoaded () {
  getPitch ();
}

function getPitch () {
  pitch.getPitch (function (err, frequency) {
    if (frequency) {
      frecuencia = frequency;
      console.log (frecuencia);
    } else {
    }
    getPitch ();
  });
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  etiqueta = label;
}

class Gestor {
  constructor(minimo_, maximo_) {
    this.minimo = minimo_;
    this.maximo = maximo_;
    this.puntero = 0;
    this.cargado = 0;
    this.mapeada = [];
    this.filtrada = 0;
    this.anterior = 0;
    this.derivada = 0;
    this.histFiltrada = [];
    this.histDerivada = [];
    this.amplificadorDerivada = 15.0;
    this.dibujarDerivada = false;
    this.f = 0.80;
  }

  actualizar(entrada_) {
    this.mapeada[this.puntero] = map(entrada_, this.minimo, this.maximo, 0.0, 1.0);
    this.mapeada[this.puntero] = constrain(this.mapeada[this.puntero], 0.0, 1.0);

    this.filtrada = this.filtrada * this.f + this.mapeada[this.puntero] * (1 - this.f);
    this.histFiltrada[this.puntero] = this.filtrada;

    this.derivada = (this.filtrada - this.anterior) * this.amplificadorDerivada;
    this.histDerivada[this.puntero] = this.derivada;

    this.anterior = this.filtrada;

    this.puntero++;

    if (this.puntero >= anchoGestor) {
      this.puntero = 0;
    }

    this.cargado = max(this.cargado, this.puntero);
  }
}

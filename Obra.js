class Obra {
  constructor () {
    this.x = random (width);
    this.y = random (height);
  
    this.tam = 400;
    this.relleno = miPaleta.darColor ();
    this.figura = random (figuras);
  
    this.velocidad = 0.1;
    this.direccion = random (360);
    this.variacionAngular = random (1, 45);
  }

  actualizarSonido (amplitud, frecuencia) {
    this.tam = map (amplitud, AMP_MIN, AMP_MAX, 400, 475);

    this.velocidad = map (frecuencia, FREC_MIN, FREC_MAX, 0.1, 5, true);
  }
  
  dibujar () {
    push ();
    tint (red (this.relleno), green (this.relleno), blue (this.relleno));
    image (this.figura, this.x, this.y, this.tam, this.tam);
    pop ();
  }

  cambiarColores (paleta) {
    let nuevoColor = paleta.darColor();
    this.relleno = color(red(nuevoColor), green(nuevoColor), blue(nuevoColor));
  }
  
  movimiento () {
    this.direccion += radians (random (-this.variacionAngular, this.variacionAngular));
  
    this.x += this.velocidad * cos (this.direccion);
    this.y += this.velocidad * sin (this.direccion);

    if (this.x >= width) {
      this.direccion = random (180);
    }
    if (this.x <= 0) {
      this.direccion = random (0);
    }
    if (this.y >= height) {
      this.direccion = random (270);
    }
    if (this.y <= 0) {
      this.direccion = random (90);
    }
  }
}
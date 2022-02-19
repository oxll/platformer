class Spike {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    context.fillStyle = "#4c4c4c";
    context.beginPath();
    context.moveTo(this.x, this.y - this.height);
    context.lineTo(this.x - this.width / 2, this.y);
    context.lineTo(this.x + this.width / 2, this.y);
    context.fill();
  }
}

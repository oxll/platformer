class Spike {
  constructor(x, y, width, heightMultiplier) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = heightMultiplier * (this.width / 2) * Math.sqrt(3);
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

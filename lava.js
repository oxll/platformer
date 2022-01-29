class Lava {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frame = 0;
  }

  render() {
    const oscillation = Math.abs(Math.sin(Date.now() / 1375)) * 75;
    context.fillStyle = `rgb(255, ${75 + oscillation}, 0)`;
    rect(this.x, this.y, this.width, this.height);
  }
}

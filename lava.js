class Lava {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.frame = 0;
  }

  render() {
    const oscillation = Math.sin(Date.now() / 1375) ** 2 * 62.5;
    context.fillStyle = `rgba(255, ${oscillation + 100}, 0, 0.9625)`;
    rect(this.x, this.y, this.width, this.height);
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    context.fillStyle = "#333333";
    rect(this.x, this.y, this.width, this.height);
  }
}

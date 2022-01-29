class Water {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render() {
    context.fillStyle = "#4287f5c8";
    rect(this.x, this.y, this.width, this.height);
  }
}

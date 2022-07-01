let img = '';
let pixel_slider;
let pixel_width;
let pixel_height;
let input;
let save_button;
let colorPicker;

function setup() {
  canvas = createCanvas(1000, 1000, WEBGL);
  pg = createGraphics(256, 256);
  canvas.drop(gotFile); // ドラッグ＆ドロップされた画像を取得
  frameRate(1); // randomで色がチカチカしすぎないよう、アニメーションの速度を下げる

  pixelDensity(1); // 解像度を変えたい場合は、ここをいじる
  pg.background(0);

  pg.textSize(30);
  fill(255, 0, 0);
  pg.text("pixel_size", width * 0.75, height * 0.05);
  pg.text("line_width", width * 0.75, height * 0.15);
  pg.text("pixel_width", width * 0.05, height * 0.05);
  pg.text("pixel_height", width * 0.05, height * 0.15);

  // 操作用のGUIの作成
  pixel_slider = createSlider(0, 100, 50, 5);
  pixel_slider.position(width * 0.75, height * 0.15);
  pixel_slider.style("width", "200px");
  line_slider = createSlider(0, 5, 1, 0.5);
  line_slider.position(width * 0.75, height * 0.25);
  line_slider.style("width", "200px");
  pixel_width = createSlider(1, 5, 1, 0.5);
  pixel_width.position(width * 0.05, height * 0.15);
  pixel_width.style("width", "200px");
  pixel_height = createSlider(1, 5, 1, 0.5);
  pixel_height.position(width * 0.05, height * 0.25);
  pixel_height.style("width", "200px");

  rotation_slider = createSlider(1, 20, 10, 0.5);
  rotation_slider.position(width * 0.75, height * 0.35);
  rotation_slider.style("width", "200px");
  hight_slider = createSlider(50, 300, 100, 25);
  hight_slider.position(width * 0.75, height * 0.45);
  hight_slider.style("width", "200px");

  input = createFileInput(gotFile);
  input.position(width * 0.35, height * 0.1);
  input.size(150, 300);
  save_button = createButton("-- S A V E --");
  save_button.position(width * 0.55, height * 0.1);
  save_button.size(100, 30);
  save_button.mousePressed(save_file);
  colorPicker = createColorPicker("#ed225d");
  colorPicker.position(width * 0.35, height * 0.15);

  textSize(width / 25);
  textAlign(CENTER, CENTER);
  fill(255);
  text("好きな画像をドラッグ＆ドロップしてネ☆彡", width / 2, height / 4);
  text("画像を保存したいときはクリックしてネ☆彡", width / 2, height / 3);

  // z座標用の値を容易しておく
  // for (let i = 0; i < 1000; i++) {
  //   z.push(random(-20, 20));
  // }
  // console.log(z);
}

function draw() {
    if (img) {
      background(255);
      // canvasの大きさを画像の大きさに変更
      resizeCanvas(img.width, img.height);

      // スライダーの入力値に応じてモザイクの大きさを決める
      let step = pixel_slider.value();

      // 各ピクセルの縦横を調整するための変数
      let pix_x = pixel_width.value() / 4;
      let pix_y = pixel_height.value() / 4;

      // 線の色
      let line_color = colorPicker.value();

      // 線の太さ
      let line_width = line_slider.value();

      let cols = width*2 / (step * pix_x);
      let rows = height*2 / (step * pix_y);

      let rotation = rotation_slider.value();
      let mountain_hight = hight_slider.value();


      // 画像を描画
      //image(img, -width / 2, -height / 2);

      //blendMode(ADD);
      //stroke(line_color);
      strokeWeight(line_width);

      // translate(width/2, height/2);
      rotateX(PI/rotation);
      translate(-width/2, -height/2);

      let z = [];
      for (let y = 0; y < rows; y++) {
        z[y] = []; // 2次元目の配列も初期化
        for (let x = 0; x < cols; x++) {
          z[y][x] = map(noise(x / 10, y / 10), 0, 1, -mountain_hight, mountain_hight);
        }
      }

      for (let y = 0; y < rows; y++) {
        beginShape(TRIANGLE_STRIP);
        let yoff = 0;
        for (let x = 0; x < cols; x++) {
          let r =
            red(line_color) +
            map(noise(x * step * pix_x, y * step * pix_y), 0, 1, -50, 50);
          let g =
            green(line_color) +
            map(noise(x * step * pix_x, y * step * pix_y), 0, 1, -50, 50);
          let b =
            blue(line_color) +
            map(noise(x * step * pix_x, y * step * pix_y), 0, 1, -50, 50);
          stroke(r,g,b);
          fill(img.get(x * step * pix_x, y * step * pix_y));

          let xoff = 0;
          vertex(x * step * pix_x, y * step * pix_y, z[y][x]);
          vertex(x * step * pix_x, (y+1) * step * pix_y, z[y][x]);
          xoff += 0.1;

          // rect(x*step*pix_x, y*step*pix_y, step*pix_x, step*pix_y)
        }
        yoff += 0.1;
        endShape();
      }

    }
}

function gotFile(file) {
  img = loadImage(file.data, '');
}

// inputから投稿したファイルの処理
function handleFile(file) {
  print(file);
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.hide();
  } else {
    img = null;
  }
}

function save_file() {
    saveCanvas("myImage", "png");
}

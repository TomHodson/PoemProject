let background_color = "#59115c";

let colors = [
  '#581845',
  '#900C3F',
'#C70039',
'#FF5733',
  '#FFC300',
];


let sandpiles, nextpiles;

let ch = 7; //cell height
let cw = 7; //cell width

let cells;
let gridW, gridH;

let mouseclicks = [];

// let myFont;
// function preload() {
//   myFont = loadFont('OfficeCodePro-Light.otf');
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(background_color);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(background_color);
    
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(5);
//   textAlign(CENTER);
  stroke(0);
//   textFont(myFont);
  
  gridW = ceil(width / cw);
  gridH = ceil(height / ch);
  
  sandpiles = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
  nextpiles = new Array(gridW).fill().map(i => new Array(gridH).fill(0));
  touched = new Array(gridW).fill().map(i => new Array(gridH).fill(0));

  let h = min(windowHeight, 400);
  append(mouseclicks, [windowWidth/1.7, h]);

}


//give this a function of (i,j,x,y) and it'll execute it for all the cells
function mapOverCells(f) {
    let x = 0.5 * cw;
    for(let i = 0; i < gridW; i++) {
      let y = 0.5 * ch;
      for(let j = 0; j < gridH; j++) {
        f(i,j, x, y);
        y += ch; 
    }
  x += cw; 
  }
}


function draw() {
  background('#531d5c');
  
  //add to the cell where we're holding the mouse buttong
  mouseclicks.map((c) => sandpiles[floor(c[0] / cw)][floor(c[1] / ch)] += 1);
  

  noStroke();
  mapOverCells(function(i, j, x, y) {
    //need to do the copy now before going through the loop again to modify
    nextpiles[i][j] = sandpiles[i][j];
    
    //draw the circles
    let f = sandpiles[i][j];
    if(f > 0) {
        let c = colors[(f-1) % 4];
        fill(c);  
        ellipse(x,y,cw/1.5,ch/1.5);
        //rect(x,y,cw,ch);
    }
  })

mapOverCells(function(i, j, x, y) {
      let num = sandpiles[i][j];
      if (num >= 5) {
        nextpiles[i][j] -= 4;
        if (i + 1 < gridW)
          nextpiles[i + 1][j]++;
        if (i - 1 >= 0)
          nextpiles[i - 1][j]++;
        if (j + 1 < gridH)
          nextpiles[i][j + 1]++;
        if (j - 1 >= 0)
          nextpiles[i][j - 1]++;
      }
    });

  let tmp = sandpiles;
  sandpiles = nextpiles;
  nextpiles = tmp;
}

function mouseClicked() {
 append(mouseclicks, [mouseX, mouseY]);
}
var w = 1440;
var h = 810;
var engine, render;
var boundaries;
var requestedImages = 0;
var loadedImages = 0;
var subs = [
    {t: 0, f: bound},
    {t: 1000, img: loadText("I'm still not used to it", "80px Roboto"), position: {x: w / 2, y: h - 150}, velocity: {x: 0, y: 0}, static: true, life: 1000},
    {t: 2000, img: loadText("so let me try again.", "80px Roboto"), position: {x: w / 2, y: h - 150}, velocity: {x: 0, y: 0}, static: true, life: 1500},
    {t: 7250, img: loadText("Maybe I should press earlier.", "80px Roboto"), position: {x: w / 2, y: h - 150}, velocity: {x: 0, y: 0}, static: true, life: 2500},
    {t: 12283, img: loadText("1", "100px Roboto", "darkslategray", 6), position: {x: 260, y: 530}, velocity: {x: 0, y: -0.2}, life: 300},
    {t: 12583, img: loadText("2", "100px Roboto", "darkslategray", 6), position: {x: 358, y: 530}, velocity: {x: 0, y: -0.22}, life: 300},
    {t: 12883, img: loadText("3", "100px Roboto", "darkslategray", 6), position: {x: 456, y: 530}, velocity: {x: 0, y: -0.24}, life: 300},
    {t: 13183, img: loadText("4", "100px Roboto", "darkslategray", 6), position: {x: 554, y: 530}, velocity: {x: 0, y: -0.26}, life: 300},
    {t: 13483, img: loadText("5", "100px Roboto", "darkslategray", 6), position: {x: 652, y: 530}, velocity: {x: 0, y: -0.28}, life: 300},
    {t: 13783, img: loadText("6", "100px Roboto", "darkslategray", 6), position: {x: 750, y: 530}, velocity: {x: 0, y: -0.3}, life: 300},
    {t: 14083, img: loadText("7"), position: {x: 1000, y: 530}, velocity: {x: 0, y: -0.5}, restitution: 0},
    {t: 16483, img: loadText("7"), velocity: {x: -0.25, y: -0.25}, restitution: 0},
    {t: 18883, img: loadText("7"), velocity: {x: -0.1, y: -0.5}, restitution: 0},
    {t: 20333, img: loadText("TOO FAST!", "80px Roboto"), position: {x: w / 2, y: h - 150}, velocity: {x: 0, y: 0}, static: true, life: 1000},
    {t: 23683, img: loadText("7"), velocity: {x: -(0.1 + Math.random() / 5), y: -(0.25 + Math.random() / 4)}, restitution: 0},
    {t: 26083, img: loadText("7"), velocity: {x: -(0.1 + Math.random() / 5), y: -(0.25 + Math.random() / 4)}, restitution: 0},
    {t: 28483, img: loadText("7"), velocity: {x: -(0.1 + Math.random() / 5), y: -(0.25 + Math.random() / 4)}, restitution: 0},
    {t: 29683, img: loadText("7"), velocity: {x: -(0.1 + Math.random() / 5), y: -(0.25 + Math.random() / 4)}, restitution: 0},
    {t: 30883, img: loadText("7"), velocity: {x: -(0.1 + Math.random() / 5), y: -(0.25 + Math.random() / 4)}, restitution: 0},
    {t: 32000, f: e => {
        engine.gravity.x = 0.01;
        engine.gravity.y = -0.1;
        boundaries.forEach(b => b.restitution = 1);
    }},
    {t: 33000, f: e => {
        engine.gravity.x = 0;
        engine.gravity.y = 0;
        engine.world.bodies.forEach(b => b.restitution = 1);
    }},
    {t: 33550, img: loadText("7")},
    {t: 34750, img: loadText("7")},
    {t: 35950, img: loadText("7")},
    {t: 37150, img: loadText("7")},
    {t: 38350, img: loadText("7")},
    {t: 39550, img: loadText("7")},
    {t: 40750, img: loadText("7")},
    {t: 41950, img: loadText("7")},
    {t: 43150, img: loadText("7")},
    {t: 44350, img: loadText("7")},
    {t: 45550, img: loadText("7")},
    {t: 46750, img: loadText("7")},
    {t: 47950, img: loadText("7")},
    {t: 49150, img: loadText("7")},
    {t: 50350, img: loadText("7")},
    {t: 51550, img: loadText("7")},
    {t: 52750, img: loadText("7")},
    {t: 53950, img: loadText("7")},
    {t: 55150, img: loadText("7")},
    {t: 56350, img: loadText("7")},
    {t: 57550, img: loadText("7")},
    {t: 58750, img: loadText("7")},
    {t: 59950, img: loadText("7")},
    {t: 61150, img: loadText("7")},
    {t: 62350, img: loadText("7")},
    {t: 62700, img: loadText("a", "50px Roboto", false, 5), position: {x: 990, y: 530}, velocity: {x: 0, y: 0}, life: 500},
    {t: 62900, img: loadText("e", "50px Roboto", false, 5), position: {x: 1010, y: 530}, velocity: {x: 0, y: 0}, life: 500},
    {t: 63550, img: loadText("7")},
    {t: 64750, img: loadText("7")},
    {t: 65950, img: loadText("7")},
    {t: 67150, img: loadText("7")},
    {t: 67600, img: loadText("e?", "50px Roboto", false, 5), velocity: {x: 0, y: 0}, life: 500},
    {t: 72667, img: loadText("It got a bit fast at the end.", "80px Roboto"), position: {x: w / 2, y: h - 150}, velocity: {x: 0, y: 0}, static: true, life: 2500},
    {t: 76500, f: unbound},
    {t: 80750, img: loadText("I still got a B.", "80px Roboto"), position: {x: w / 2, y: h - 150}, velocity: {x: 0, y: 0}, static: true, life: 2500}
];
for (var i = 0; i < 100; i++) {
    subs.push({t: 76500 + i, img: loadText(i ? "A" : "N", "italic 100px Roboto"), position: {x: w - 100 + i, y: h - 100 + i}})
}

function loadImage(url, f) {
    requestedImages++;
    var img = new Image();
    img.src = url;
    img.addEventListener("load", e => loadedImages++);
    return img;
}

function fit(canvas, context) {
    var data = context.getImageData(0, 0, canvas.width, canvas.height);
    var l = 0;
    var r = canvas.width - 1;
    var t = 0;
    var b = canvas.height - 1;
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            var a = data.data[4 * (canvas.width * y + x) + 3];
            if (a > 0) {
                if (l <= 0) {
                    l = x;
                }
                else {
                    r = x;
                }
                break;
            } 
        }
    }
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var a = data.data[4 * (canvas.width * y + x) + 3];
            if (a > 0) {
                if (t <= 0) {
                    t = y;
                }
                else {
                    b = y;
                }
                break;
            } 
        }
    }
    var fitted = document.createElement("canvas");
    fitted.width = r - l + 1;
    fitted.height = b - t + 1;
    var fc = fitted.getContext("2d");
    fc.putImageData(data, -l, -t);
    return fitted;
}

function loadText(text, font, color, strokeWidth) {
    if (!font) {font = "120px Roboto";}
    if (!color) {color = "goldenrod";}
    if (!strokeWidth) {strokeWidth = 12;}
    
    var span = document.createElement("span");
    span.style.font = font;
    span.innerHTML = text;

    document.body.appendChild(span);
    var rect = span.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    document.body.removeChild(span);
    
    var canvas = document.createElement("canvas");
    canvas.width = width + strokeWidth * 3;
    canvas.height = height + strokeWidth * 3;

    var context = canvas.getContext("2d");
    context.font = font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineJoin = "round";

    context.lineWidth = strokeWidth * 2;
    context.strokeStyle = "black";
    context.strokeText(text, canvas.width / 2, canvas.height / 2);

    context.lineWidth = strokeWidth;
    context.strokeStyle = "white";
    context.strokeText(text, canvas.width / 2, canvas.height / 2);

    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    var fitted = fit(canvas, context);
    var url = fitted.toDataURL();
    return loadImage(url);
}

function bound() {
    var d = 1000;
    var options = {isStatic: true, restitution: 1, render: {visible: false}};
    var l = Matter.Bodies.rectangle(-d / 2, h / 2, d, h, options);
    var r = Matter.Bodies.rectangle(w + d / 2, h / 2, d, h, options);
    var t = Matter.Bodies.rectangle(w / 2, -d / 2, w, d, options);
    var b = Matter.Bodies.rectangle(w / 2, h + d / 2, w, d, options);
    var f = Matter.Bodies.rectangle(w - 120, h - 180, 240, 360, options);
    boundaries = [l, r, t, b, f];
    Matter.Composite.add(engine.world, boundaries);
}

function unbound() {
    Matter.World.remove(engine.world, boundaries);
}

function playback() {
    var t0 = 0;
    var played = new Set;
    function goplay(t) {
        if (!t0) {t0 = t;}
        for (var sub of subs) {
            if (sub.t < t - t0 && !played.has(sub)) {
                played.add(sub);
                if (sub.img) {
                    var body = spawn(
                        sub.img,
                        sub.position ? sub.position : {x: 1000, y: 530},
                        sub.velocity ? sub.velocity : {x: -(0.1 + Math.random() / 5), y: -(0.1 + Math.random() / 5)},
                        typeof sub.restitution != "undefined" ? sub.restitution : 1,
                        sub.static ? sub.static : false
                    );
                    if (sub.life) {
                        subs.push({
                            t: sub.t + sub.life,
                            f: e => Matter.World.remove(engine.world, body)
                        });
                    }
                }
                if (sub.f) {
                    sub.f();
                }
            }
        }
        requestAnimationFrame(goplay);
    }
    requestAnimationFrame(goplay);
    window.removeEventListener("keydown", playback);
    // render.options.background = "lime";
    // render.options.background = "rgba(0, 0, 0, 0.9)";
    render.options.background = "transparent";
    document.querySelector("video").play();
}

function spawn(img, position, velocity, restitution, static) {
    var options = {
        restitution: restitution,
        frictionAir: 0,
        render: {sprite: {texture: img.src}},
        isStatic: static
    };
    // if (img.width < 2 * img.height && img.height < 2 * img.width) {
    //     var radius = (img.width + img.height) / 4;
    //     var item = Matter.Bodies.circle(
    //         position.x,
    //         position.y,
    //         radius,
    //         options
    //     );
    // }
    // else {
        var item = Matter.Bodies.rectangle(
            position.x,
            position.y,
            img.width,
            img.height,
            options
        );
    // }
    Matter.Body.applyForce(item, item.position, velocity);
    Matter.Composite.add(engine.world, [item]);
    return item;
}

function main() {
    engine = Matter.Engine.create({
        gravity: {
            y: 1
        }
    });
    render = Matter.Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: w,
            height: h,
            background: "rebeccapurple",
            wireframes: false
        }
    });
    Matter.Render.run(render);
    var runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    window.addEventListener("keydown", playback);
}

window.addEventListener("load", main);

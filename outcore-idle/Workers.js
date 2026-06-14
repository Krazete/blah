/* outcore - idle game - stage 8 */
(function (index) {
/* data */
var workers = [
    {x:  0, y: 16, index: 3, orientation: 3, inventory: 0, queue: []},
    {x: 19, y: 13, index: 1, orientation: 3, inventory: 0, queue: []},
    {x: 21, y:  1, index: 2, orientation: 3, inventory: 0, queue: []}
];
var objects = {
    /* coin spawner buttons */
    b00: {x:  0, y: 14, value:   6, active: 1, activate: ["c0a", "c0b", "c0c", "c0d", "c0e", "c0f"]},
    b01: {x: 14, y: 12, value:   2, active: 1, activate: ["c05", "c06"]},
    b02: {x: 14, y:  4, value:   2, active: 1, activate: ["c08", "c09"]},
    b03: {x:  3, y:  3, value:   6, active: 1, activate: ["c00", "c01", "c02", "c03", "c04", "c07"]},
    /* blender deposit buttons */
    d00: {x:  6, y:  8, value:  10, active: 0, activate: ["c10"]},
    d01: {x:  6, y:  7, value:  10, active: 0, activate: ["c11"]},
    d02: {x:  6, y:  6, value:  10, active: 0, activate: ["c12"]},
    d10: {x: 14, y: 10, value:  10, active: 0, activate: ["c20"]},
    /* final deposit button */
    d20: {x: 25, y:  1, value: 180, active: 0, activate: []},
    /* $1 coins */
    c00: {x: 17, y: 16, value:   1, active: 0, activate: ["b03"]},
    c01: {x: 21, y: 16, value:   1, active: 0, activate: ["b03"]},
    c02: {x: 24, y: 15, value:   1, active: 0, activate: ["b03"]},
    c03: {x: 22, y: 13, value:   1, active: 0, activate: ["b03"]},
    c04: {x: 24, y: 11, value:   1, active: 0, activate: ["b03"]},
    c05: {x:  5, y: 10, value:   1, active: 0, activate: ["b01"]},
    c06: {x:  5, y:  9, value:   1, active: 0, activate: ["b01"]},
    c07: {x:  4, y:  7, value:   1, active: 0, activate: ["b03"]},
    c08: {x:  5, y:  5, value:   1, active: 0, activate: ["b02"]},
    c09: {x:  5, y:  4, value:   1, active: 0, activate: ["b02"]},
    c0a: {x: 15, y:  2, value:   1, active: 0, activate: ["b00"]},
    c0b: {x: 17, y:  2, value:   1, active: 0, activate: ["b00"]},
    c0c: {x: 19, y:  2, value:   1, active: 0, activate: ["b00"]},
    c0d: {x: 15, y:  0, value:   1, active: 0, activate: ["b00"]},
    c0e: {x: 17, y:  0, value:   1, active: 0, activate: ["b00"]},
    c0f: {x: 19, y:  0, value:   1, active: 0, activate: ["b00"]},
    /* $5 coins */
    c10: {x:  9, y:  8, value:  15, active: 0, activate: ["d00"]},
    c11: {x:  9, y:  7, value:  15, active: 0, activate: ["d01"]},
    c12: {x:  9, y:  6, value:  15, active: 0, activate: ["d02"]},
    /* $15 coins */
    c20: {x: 17, y: 10, value: 225, active: 0, activate: ["d10"]}
};
var blocks = workers.concat([
    /* $1 -> $5 blender deposit button */
    {x: 15, y: 10},
    {x: 16, y: 10},
    /* $5 -> $15 blender deposit button */
    {x:  7, y:  8},
    {x:  8, y:  8},
    {x:  7, y:  7},
    {x:  8, y:  7},
    {x:  7, y:  6},
    {x:  8, y:  6},
    /* block */
    {x: 23, y:  1}
]);

function distance(worker, goal) {
    return Math.abs(goal.x - worker.x) + Math.abs(goal.y - worker.y) + 1 * (
        worker.x != goal.x && worker.y != goal.y
    ) + 2 * (
        worker.orientation == 0 && goal.x < worker.x ||
        worker.orientation == 1 && goal.y < worker.y ||
        worker.orientation == 2 && worker.x < goal.x ||
        worker.orientation == 3 && worker.y < goal.y
    );
}

function godo(worker, f, e) {
    if (f == MoveForward) {
        worker.x += worker.orientation == 0 ? 1 : worker.orientation == 2 ? -1 : 0;
        worker.y += worker.orientation == 1 ? 1 : worker.orientation == 3 ? -1 : 0;
    }
    else if (f == TurnLeft) {
        worker.orientation = (worker.orientation + 1) % 4;
    }
    else if (f == TurnRight) {
        worker.orientation = (worker.orientation + 3) % 4;
    }
    if (worker.index == index) {
        f(e);
    }
}

function move(worker, goal) {
    if (worker.queue.length > 0) {
        move(worker, worker.queue.pop());
        return;
    }
    if (goal.cost == 9999) {
        if (worker.index == index) {
            ConsoleLog("NO GOAL");
        }
        return;
    }
    if (worker.x == goal.x && worker.y == goal.y) {
        if (worker.index == index) {
            ConsoleLog("AT GOAL");
        }
    }
    else if (
        worker.orientation == 0 && worker.x < goal.x ||
        worker.orientation == 1 && worker.y < goal.y ||
        worker.orientation == 2 && goal.x < worker.x ||
        worker.orientation == 3 && goal.y < worker.y
    ) {
        var dx = worker.orientation == 0 ? 1 : worker.orientation == 2 ? -1 : 0;
        var dy = worker.orientation == 1 ? 1 : worker.orientation == 3 ? -1 : 0;
        var blocked = worker.index > 0 && worker.x + dx > 11 && worker.y + dy > 7;
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (worker.x + dx == block.x && worker.y + dy == block.y) {
                blocked = true;
                break;
            }
        }
        if (blocked) {
            var unblocker = {
                x: worker.x + (dx ? 0 : -1),
                y: worker.y + (dy ? 0 : -1)
            };
            move(worker, unblocker);
            worker.queue.push(unblocker);
        }
        else {
            godo(worker, MoveForward);
        }
    }
    else {
        if (
            worker.orientation == 0 && worker.y < goal.y ||
            worker.orientation == 1 && goal.x < worker.x ||
            worker.orientation == 2 && goal.y < worker.y ||
            worker.orientation == 3 && worker.x < goal.x
        ) {
            godo(worker, TurnLeft);
        }
        else {
            godo(worker, TurnRight);
        }
    }
}

var testing = 1000;
var lol = [];

if (testing) {
    MoveForward = function(){};
    TurnLeft = function(){};
    TurnRight = function(){};
    DoNothing = function(){};
    ConsoleLog = function(){};
    document.documentElement.style = "background: black; color: white; font-family: Consolas;";
}

var carat = ">^<v";

function alphadecimal(n) {
    return n > 9 ? String.fromCharCode(87 + n) : n;
}

while (1) {
    for (var i = 0; i < workers.length; i++) {
        var worker = workers[i];
        var keys = Object.keys(objects);
        var goal = {x: -1, y: -1, cost: 9999};
        if (worker.inventory >= 6) {
            goal = objects["d20"];
        }
        else {
            for (var j = 0; j < keys.length; j++) {
                var object = objects[keys[j]];
                if (
                    worker.index == 1 && (object.x < 12 || object.y < 8) ||
                    worker.index > 1 && object.x > 11 && object.y > 7 ||
                    worker.x == object.x && worker.y == object.y ||
                    object.value < 1
                ) {
                    continue;
                }
                var cost = distance(worker, object) - object.value;
                if (cost < goal.cost) {
                    goal = {x: object.x, y: object.y, cost: cost};
                }
            }
        }
        move(worker, goal);
        for (var j = 0; j < keys.length; j++) {
            var object = objects[keys[j]];
            if (worker.x == object.x && worker.y == object.y) {
                for (var k = 0; k < object.activate.length; k++) {
                    var id = object.activate[k];
                    objects[id].value++;
                }
                object.value = 0;
                if (keys[j][0] == "c") {
                    worker.inventory++;
                }
                if (keys[j][0] == "d") {
                    worker.inventory--;
                }
            }
        }
    }
    if (testing--) {
        var area = Array(17).fill().map(e => Array(26).fill("---"));
        try {
        for (var block of blocks) {
            area[block.y][block.x] = "xxx";
        }
        for (var id in objects) {
            var object = objects[id];
            area[object.y][object.x] = id.slice(0, 2) + alphadecimal(object.value);
        }
        for (var worker of workers) {
            area[worker.y][worker.x] = worker.index + carat[worker.orientation] + alphadecimal(worker.inventory);
        }
        area.sort(e => -1);
        lol.push(area.map(e => e.join(" ")).join("<br>"));
        if (testing == 0) {
            lol.forEach((e, i) => setTimeout(o => document.documentElement.innerHTML = e, 50 * i));
            break;
        }
        } catch (e) {}
    }
}
})(1)
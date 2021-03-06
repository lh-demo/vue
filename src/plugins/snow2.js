// Cross-browser-compliant
requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 60);
    };
let Snow = function (x, y, r, fn) {
    return {
        update: function () {
            x = fn.x(x, y);
            y = fn.y(y, y);

            if (x > window.innerWidth ||
                x < 0 ||
                y > window.innerHeight ||
                y < 0
            ) {
                x = getRandom('x');
                y = 0;
            }
        },
        draw: function (cxt) {
            var grd = cxt.createRadialGradient(x, y, 0, x, y, r);
            grd.addColorStop(0, "rgba(255, 255, 255, 0.9)");
            grd.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
            grd.addColorStop(1, "rgba(255, 255, 255, 0)");
            cxt.fillStyle = grd;
            cxt.fillRect(x - r, y - r, r * 2, r * 2);
        }
    }
}

let SnowList = function () {
    let list = [];
    return {
        push: function (snow) {
            list.push(snow);
        },
        update: function () {
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].update();
            }
        },
        draw: function (cxt) {
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].draw(cxt);
            }
        },
        get: function (i) {
            return list[i];
        },
        size: function () {
            return list.length;
        }
    }
}

function getRandom(option) {
    var ret, random;
    switch (option) {
        case 'x':
            ret = Math.random() * window.innerWidth;
            break;
        case 'y':
            ret = Math.random() * window.innerHeight;
            break;
        case 'r':
            ret = 2 + (Math.random() * 6);
            break;
        case 'fnx':
            random = 27 + Math.random() * 100;
            ret = function (x, y) {
                return x + 0.5 * Math.sin(y / random);
            };
            break;
        case 'fny':
            random = 0.4 + Math.random() * 1.4
            ret = function (x, y) {
                return y + random;
            };
            break;
    }
    return ret;
}

// Start snow
function startSnow() {
    // Create canvas
    var canvas = document.getElementById('canvas_snow');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    var cxt = canvas.getContext('2d');
    // Create snow objects
    var snowList = new SnowList();
    for (var i = 0; i < 200; i++) {
        var snow, randomX, randomY, randomR, randomFnx, randomFny;
        randomX = getRandom('x');
        randomY = getRandom('y');
        randomR = getRandom('r');
        randomFnx = getRandom('fnx');
        randomFny = getRandom('fny');
        snow = new Snow(randomX, randomY, randomR, {
            x: randomFnx,
            y: randomFny
        });
        snow.draw(cxt);
        snowList.push(snow);
    }
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    snowList.update();
    snowList.draw(cxt);
    // Update snow position data, and redraw them in each frame
    var snowFlow = function () {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        snowList.update();
        snowList.draw(cxt);
        requestAnimationFrame(snowFlow);
        // requestAnimationFrame(arguments.callee);
    }
    snowFlow();
    alert("aaaaa");
}

// Handle window resize
window.onresize = function () {
    var canvasSnow = document.getElementById('canvas_snow');
    canvasSnow.width = window.innerWidth;
    canvasSnow.height = window.innerHeight;
}
// Let it snow O(∩_∩)0
export default {
    startSnow
}
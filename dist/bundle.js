(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { Perspective } from "./test/Perspective";
var Perspective = require('./Perspective.js');
class HexagonMapDrawer {
    constructor() {
        if (document.getElementById('container') == null) {
            let container = document.createElement('div');
            container.id = 'container';
            document.body.appendChild(container);
        }
    }
    setupCanvas(ctx, canvas_width, canvas_height) {
        //todo ctx validation
        if (canvas_width <= 0) {
            throw new Error("\"canvas_width\" is invalid.");
        }
        if (canvas_height <= 0) {
            throw new Error("\"canvas_height\" is invalid.");
        }
        this.ctx = ctx;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
    }
    setupParameter(flatness, grid_width, grid_width_coefficient, grid_height_coefficient, origin_x, origin_y, is_draw_coordinate) {
        if (flatness <= 0 || flatness > 1) {
            throw new Error("\"flatness\" is invalid.");
        }
        this.flatness = flatness;
        this.grid_width = grid_width;
        this.grid_width_coefficient = grid_width_coefficient;
        this.grid_height_coefficient = grid_height_coefficient;
        this.origin_x = origin_x;
        this.origin_y = origin_y;
        this.is_draw_coordinate = is_draw_coordinate;
    }
    setupRandomMode(is_random_mode, image_count) {
        this.is_random_mode = is_random_mode;
        this.random_image_count = image_count;
    }
    draw(map) {
        let cells = map.getCells();
        cells.forEach(element => {
            let x = this.origin_x + element.x * this.grid_width * 1.5;
            let y = this.origin_y + element.y * this.grid_width * 0.8660254037844 * this.flatness;
            let canvas = document.createElement('canvas');
            document.getElementById('container').appendChild(canvas);
            canvas.style.left = x.toString() + "px";
            canvas.style.top = y.toString() + "px";
            canvas.width = this.grid_width * this.grid_width_coefficient;
            canvas.height = this.grid_width * this.grid_height_coefficient;
            let image_path;
            if (!this.is_random_mode) {
                image_path = "./img/image0.png";
            }
            else {
                let random_number = Math.round(Math.random() * this.random_image_count)
                    % this.random_image_count;
                image_path = "./img/image" + random_number + ".png";
            }
            this.drawPerspectiveTransformedImage(canvas, this.flatness, image_path);
            if (this.is_draw_coordinate) {
                this.drawCoordinate(x, y, element.x, element.y, this.grid_width);
            }
        });
    }
    clear() {
        if (document.getElementById('container') == null) {
            let container = document.createElement('div');
            container.id = 'container';
            document.body.appendChild(container);
        }
        else {
            document.getElementById('container').innerHTML = "";
        }
    }
    drawObject(map, x_map, y_map, x_draw_offset, y_draw_offset, width, height, image_name) {
        let cells = map.getCells();
        let is_it_there = false;
        cells.forEach(element => {
            if (element.x == x_map &&
                element.y == y_map) {
                is_it_there = true;
                let x_draw = this.origin_x + element.x * this.grid_width * 1.5;
                let y_draw = this.origin_y + element.y * this.grid_width * 0.8660254037844 * this.flatness;
                x_draw += x_draw_offset;
                y_draw += y_draw_offset;
                let image_path = "./img/" + image_name + ".png";
                let img = document.createElement('img');
                img.src = image_path;
                img.style.left = x_draw.toString() + "px";
                img.style.top = y_draw.toString() + "px";
                img.style.width = width + "px";
                img.style.height = height + "px";
                document.body.appendChild(img);
            }
        });
        if (!is_it_there) {
            throw new Error("The coordinate used in \"drawObject()\" is invalid.");
        }
    }
    drawCoordinate(draw_x, draw_y, x, y, grid_width) {
        let div = document.createElement('div');
        document.getElementById('container').appendChild(div);
        div.style.left = draw_x + grid_width + "px";
        div.style.top = draw_y + grid_width + "px";
        div.style.fontSize = "30px";
        div.innerHTML = x.toString() + ", " + y.toString();
    }
    drawPerspectiveTransformedImage(canvas, flatness, image_path) {
        var image = new Image();
        let width = canvas.width;
        let height = canvas.height;
        image.onload = function () {
            var ctx = canvas.getContext("2d");
            var p = new Perspective(ctx, image);
            p.draw([
                [0, (1 - flatness) * height],
                [width, (1 - flatness) * height],
                [width, height],
                [0, height]
            ]);
        };
        image.src = image_path;
    }
}
exports.HexagonMapDrawer = HexagonMapDrawer;

},{"./Perspective.js":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HexagonCell_1 = require("./hex_map_core/HexagonCell");
class HexagonMapProcessor {
    constructor() {
        this.max_hole_count_per_col = 0;
        this.possibility_to_see_a_hole = 0;
    }
    updateMap(map) {
        for (let index = map.cells.length - 1; index >= 0; index--) {
            if (map.cells[index].x === 0) {
                map.cells.splice(index, 1);
            }
            else {
                map.cells[index].x -= 1;
            }
        }
        map.is_first_col_a_little_col = !map.is_first_col_a_little_col;
        let initial_y;
        if (map.col_count % 2 == 1) {
            initial_y = map.is_first_col_a_little_col == true ? 1 : 0;
        }
        else {
            initial_y = map.is_first_col_a_little_col == true ? 0 : 1;
        }
        let hole_count = 0;
        for (let y = initial_y; y < map.row_count; y += 2) {
            if (hole_count < this.max_hole_count_per_col) {
                if (Math.random() < this.possibility_to_see_a_hole) {
                    hole_count++;
                    continue;
                }
            }
            let cell = new HexagonCell_1.HexagonCell();
            cell.x = map.col_count - 1;
            cell.y = y;
            map.cells.push(cell);
        }
    }
}
exports.HexagonMapProcessor = HexagonMapProcessor;

},{"./hex_map_core/HexagonCell":4}],3:[function(require,module,exports){
(function (global){
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
}
else if (typeof define === "function" && define.amd) {
    define([], f);
}
else {
    var g;
    if (typeof window !== "undefined") {
        g = window;
    }
    else if (typeof global !== "undefined") {
        g = global;
    }
    else if (typeof self !== "undefined") {
        g = self;
    }
    else {
        g = this;
    }
    g.Perspective = f();
} })(function () {
    var define, module, exports;
    return (function e(t, n, r) { function s(o, u) { if (!n[o]) {
        if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a)
                return a(o, !0);
            if (i)
                return i(o, !0);
            var f = new Error("Cannot find module '" + o + "'");
            throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = { exports: {} };
        t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e); }, l, l.exports, e, t, n, r);
    } return n[o].exports; } var i = typeof require == "function" && require; for (var o = 0; o < r.length; o++)
        s(r[o]); return s; })({ 1: [function (require, module, exports) {
                // Copyright 2010 futomi  http://www.html5.jp/
                //
                // Licensed under the Apache License, Version 2.0 (the "License");
                // you may not use this file except in compliance with the License.
                // You may obtain a copy of the License at
                //
                //   http://www.apache.org/licenses/LICENSE-2.0
                //
                // Unless required by applicable law or agreed to in writing, software
                // distributed under the License is distributed on an "AS IS" BASIS,
                // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                // See the License for the specific language governing permissions and
                // limitations under the License.
                //
                // perspective.js v0.0.2
                // 2010-08-28
                //
                // This file was modified by Fabien LOISON <http://www.flozz.fr/>
                /* -------------------------------------------------------------------
                 * define objects (name space) for this library.
                 * ----------------------------------------------------------------- */
                var html5jp = window.html5jp || {};
                (function () {
                    /* -------------------------------------------------------------------
                     * constructor
                     * ----------------------------------------------------------------- */
                    html5jp.perspective = function (ctxd, image) {
                        // check the arguments
                        if (!ctxd || !ctxd.strokeStyle) {
                            return;
                        }
                        if (!image || !image.width || !image.height) {
                            return;
                        }
                        // prepare a <canvas> for the image
                        var cvso = document.createElement('canvas');
                        cvso.width = parseInt(image.width);
                        cvso.height = parseInt(image.height);
                        var ctxo = cvso.getContext('2d');
                        ctxo.drawImage(image, 0, 0, cvso.width, cvso.height);
                        // prepare a <canvas> for the transformed image
                        var cvst = document.createElement('canvas');
                        cvst.width = ctxd.canvas.width;
                        cvst.height = ctxd.canvas.height;
                        var ctxt = cvst.getContext('2d');
                        // parameters
                        this.p = {
                            ctxd: ctxd,
                            cvso: cvso,
                            ctxo: ctxo,
                            ctxt: ctxt
                        };
                    };
                    /* -------------------------------------------------------------------
                     * prototypes
                     * ----------------------------------------------------------------- */
                    var proto = html5jp.perspective.prototype;
                    /* -------------------------------------------------------------------
                     * public methods
                     * ----------------------------------------------------------------- */
                    proto.draw = function (points) {
                        var d0x = points[0][0];
                        var d0y = points[0][1];
                        var d1x = points[1][0];
                        var d1y = points[1][1];
                        var d2x = points[2][0];
                        var d2y = points[2][1];
                        var d3x = points[3][0];
                        var d3y = points[3][1];
                        // compute the dimension of each side
                        var dims = [
                            Math.sqrt(Math.pow(d0x - d1x, 2) + Math.pow(d0y - d1y, 2)),
                            Math.sqrt(Math.pow(d1x - d2x, 2) + Math.pow(d1y - d2y, 2)),
                            Math.sqrt(Math.pow(d2x - d3x, 2) + Math.pow(d2y - d3y, 2)),
                            Math.sqrt(Math.pow(d3x - d0x, 2) + Math.pow(d3y - d0y, 2)) // left side
                        ];
                        //
                        var ow = this.p.cvso.width;
                        var oh = this.p.cvso.height;
                        // specify the index of which dimension is longest
                        var base_index = 0;
                        var max_scale_rate = 0;
                        var zero_num = 0;
                        for (var i = 0; i < 4; i++) {
                            var rate = 0;
                            if (i % 2) {
                                rate = dims[i] / ow;
                            }
                            else {
                                rate = dims[i] / oh;
                            }
                            if (rate > max_scale_rate) {
                                base_index = i;
                                max_scale_rate = rate;
                            }
                            if (dims[i] == 0) {
                                zero_num++;
                            }
                        }
                        if (zero_num > 1) {
                            return;
                        }
                        //
                        var step = 2;
                        var cover_step = step * 5;
                        //
                        var ctxo = this.p.ctxo;
                        var ctxt = this.p.ctxt;
                        ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
                        if (base_index % 2 == 0) { // top or bottom side
                            var ctxl = this.create_canvas_context(ow, cover_step);
                            ctxl.globalCompositeOperation = "copy";
                            var cvsl = ctxl.canvas;
                            for (var y = 0; y < oh; y += step) {
                                var r = y / oh;
                                var sx = d0x + (d3x - d0x) * r;
                                var sy = d0y + (d3y - d0y) * r;
                                var ex = d1x + (d2x - d1x) * r;
                                var ey = d1y + (d2y - d1y) * r;
                                var ag = Math.atan((ey - sy) / (ex - sx));
                                var sc = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2)) / ow;
                                ctxl.setTransform(1, 0, 0, 1, 0, -y);
                                ctxl.drawImage(ctxo.canvas, 0, 0);
                                //
                                ctxt.translate(sx, sy);
                                ctxt.rotate(ag);
                                ctxt.scale(sc, sc);
                                ctxt.drawImage(cvsl, 0, 0);
                                //
                                ctxt.setTransform(1, 0, 0, 1, 0, 0);
                            }
                        }
                        else if (base_index % 2 == 1) { // right or left side
                            var ctxl = this.create_canvas_context(cover_step, oh);
                            ctxl.globalCompositeOperation = "copy";
                            var cvsl = ctxl.canvas;
                            for (var x = 0; x < ow; x += step) {
                                var r = x / ow;
                                var sx = d0x + (d1x - d0x) * r;
                                var sy = d0y + (d1y - d0y) * r;
                                var ex = d3x + (d2x - d3x) * r;
                                var ey = d3y + (d2y - d3y) * r;
                                var ag = Math.atan((sx - ex) / (ey - sy));
                                var sc = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2)) / oh;
                                ctxl.setTransform(1, 0, 0, 1, -x, 0);
                                ctxl.drawImage(ctxo.canvas, 0, 0);
                                //
                                ctxt.translate(sx, sy);
                                ctxt.rotate(ag);
                                ctxt.scale(sc, sc);
                                ctxt.drawImage(cvsl, 0, 0);
                                //
                                ctxt.setTransform(1, 0, 0, 1, 0, 0);
                            }
                        }
                        // set a clipping path and draw the transformed image on the destination canvas.
                        this.p.ctxd.save();
                        this.p.ctxd.drawImage(ctxt.canvas, 0, 0);
                        this._applyMask(this.p.ctxd, [[d0x, d0y], [d1x, d1y], [d2x, d2y], [d3x, d3y]]);
                        this.p.ctxd.restore();
                    };
                    /* -------------------------------------------------------------------
                     * private methods
                     * ----------------------------------------------------------------- */
                    proto.create_canvas_context = function (w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;
                        var ctx = canvas.getContext('2d');
                        return ctx;
                    };
                    proto._applyMask = function (ctx, points) {
                        ctx.beginPath();
                        ctx.moveTo(points[0][0], points[0][1]);
                        for (var i = 1; i < points.length; i++) {
                            ctx.lineTo(points[i][0], points[i][1]);
                        }
                        ctx.closePath();
                        ctx.globalCompositeOperation = "destination-in";
                        ctx.fill();
                        ctx.globalCompositeOperation = "source-over";
                    };
                })();
                module.exports = html5jp.perspective;
            }, {}] }, {}, [1])(1);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HexagonCell {
    constructor() {
        this.x = null;
        this.y = null;
    }
}
exports.HexagonCell = HexagonCell;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HexagonCell_1 = require("./HexagonCell");
class HexagonMap {
    constructor(row_count, col_count) {
        this.row_count = row_count;
        this.col_count = col_count;
        this.is_first_col_a_little_col = true;
        // grid initialization
        this.cells = new Array();
        for (let col = 0; col < col_count; col++) {
            let init_row;
            if (col % 2 == 0) {
                init_row = this.is_first_col_a_little_col == true ? 1 : 0;
            }
            else {
                init_row = this.is_first_col_a_little_col == true ? 0 : 1;
            }
            for (let row = init_row; row < row_count; row += 2) {
                let cell = new HexagonCell_1.HexagonCell();
                cell.y = row;
                cell.x = col;
                this.cells.push(cell);
            }
        }
    }
    getCells() {
        const clone = Object.assign([], this.cells);
        return clone;
    }
}
exports.HexagonMap = HexagonMap;

},{"./HexagonCell":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HexagonMap_1 = require("./hex_map_core/HexagonMap");
const HexagonMapDrawer_1 = require("./HexagonMapDrawer");
const HexagonMapProcessor_1 = require("./HexagonMapProcessor");
let map;
let drawer;
let processor;
function initialization() {
    // Setup map
    let row_count = 9;
    let col_count = 7;
    map = new HexagonMap_1.HexagonMap(row_count, col_count);
    // Setup drawer
    drawer = new HexagonMapDrawer_1.HexagonMapDrawer();
    let flatness = 0.7;
    let grid_width = 100;
    let grid_width_coefficient = 1.95;
    let grid_height_coefficient = 1.9;
    let FRAME_WIDTH = 1000;
    let origin_x = FRAME_WIDTH / 2;
    let origin_y = 50;
    let is_draw_coordinate = false;
    drawer.setupParameter(flatness, grid_width, grid_width_coefficient, grid_height_coefficient, origin_x, origin_y, is_draw_coordinate);
    let is_random_mode = false;
    let random_image_count = 3;
    drawer.setupRandomMode(is_random_mode, random_image_count);
    // Draw
    drawer.draw(map);
    // Add Click Event Listener
    processor = new HexagonMapProcessor_1.HexagonMapProcessor();
    processor.max_hole_count_per_col = 1; // 每欄最多 1 個破洞
    processor.possibility_to_see_a_hole = 0.2; // 破洞機率 20%
    addListener();
}
function addListener() {
    document.getElementsByTagName('button')[0].addEventListener('click', () => {
        processor.updateMap(map);
        drawer.clear();
        drawer.draw(map);
    });
}
initialization();

},{"./HexagonMapDrawer":1,"./HexagonMapProcessor":2,"./hex_map_core/HexagonMap":5}]},{},[6]);

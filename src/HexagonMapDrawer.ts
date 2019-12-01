import { HexagonCell } from "./hex_map_core/HexagonCell";
import { HexagonMap } from "./hex_map_core/HexagonMap";
// import { Perspective } from "./test/Perspective";

var Perspective = require('./Perspective.js');

export class HexagonMapDrawer {
    private ctx: CanvasRenderingContext2D;
    private canvas_width: number;
    private canvas_height: number;
    private flatness: number;
    private perspective_coef: number;
    private grid_width: number;
    private grid_height: number;
    private grid_width_coefficient: number;
    private grid_height_coefficient: number;
    private origin_x: number;
    private origin_y: number;
    private is_random_mode: boolean;
    private random_image_count: number;
    private is_draw_coordinate: boolean;


    public constructor() {
        if (document.getElementById('container') == null) {
            let container: HTMLDivElement = document.createElement('div');
            container.id = 'container';
            document.body.appendChild(container);
        }
    }
    public setupCanvas(
        ctx: CanvasRenderingContext2D,
        canvas_width: number,
        canvas_height: number
    ): void {
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
    public setupParameter(
        flatness: number,
        grid_width: number,
        grid_width_coefficient: number,
        grid_height_coefficient: number,
        origin_x: number,
        origin_y: number,
        is_draw_coordinate: boolean
    ): void {
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
    public setupRandomMode(is_random_mode: boolean, image_count: number): void {
        this.is_random_mode = is_random_mode;
        this.random_image_count = image_count;
    }
    public draw(map: HexagonMap): void {
        let cells: Array<HexagonCell> = map.getCells();
        cells.forEach(element => {
            let x: number = this.origin_x + element.x * this.grid_width * 1.5;
            let y: number = this.origin_y + element.y * this.grid_width * 0.8660254037844 * this.flatness;

            let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.createElement('canvas');
            document.getElementById('container').appendChild(canvas);
            canvas.style.left = x.toString() + "px";
            canvas.style.top = y.toString() + "px";
            canvas.width = this.grid_width * this.grid_width_coefficient;
            canvas.height = this.grid_width * this.grid_height_coefficient;

            let image_path: string;
            if (!this.is_random_mode) {
                image_path = "./img/image0.png";
            }
            else {
                let random_number =
                    Math.round(Math.random() * this.random_image_count)
                    % this.random_image_count;
                image_path = "./img/image" + random_number + ".png";
            }
            this.drawPerspectiveTransformedImage(canvas, this.flatness, image_path);
            if (this.is_draw_coordinate) {
                this.drawCoordinate(
                    x, y,
                    element.x, element.y,
                    this.grid_width);
            }
        });
    }
    public drawObject(
        map: HexagonMap,
        x_map: number,
        y_map: number,
        x_draw_offset: number,
        y_draw_offset: number,
        width: number,
        height: number,
        image_name: string
    ): void {
        let cells: Array<HexagonCell> = map.getCells();
        let is_it_there: boolean = false;
        cells.forEach(element => {
            if (element.x == x_map &&
                element.y == y_map) {
                is_it_there = true;

                let x_draw: number = this.origin_x + element.x * this.grid_width * 1.5;
                let y_draw: number = this.origin_y + element.y * this.grid_width * 0.8660254037844 * this.flatness;
                x_draw += x_draw_offset;
                y_draw += y_draw_offset;

                let image_path = "./img/" + image_name + ".png";
                let img: HTMLImageElement = <HTMLImageElement>document.createElement('img');
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

    private drawCoordinate(
        draw_x: number,
        draw_y: number,
        x: number,
        y: number,
        grid_width: number): void {
        let div: HTMLDivElement = document.createElement('div');
        document.getElementById('container').appendChild(div);
        div.style.left = draw_x + grid_width + "px";
        div.style.top = draw_y + grid_width + "px";
        div.style.fontSize = "30px";
        div.innerHTML = x.toString() + ", " + y.toString();
    }
    private drawPerspectiveTransformedImage(
        canvas: HTMLCanvasElement,
        flatness: number,
        image_path): void {
        var image: any = new Image();
        let width: number = canvas.width;
        let height: number = canvas.height;

        image.onload = function () {
            var ctx = canvas.getContext("2d");
            var p = new Perspective(ctx, image);
            p.draw([
                [0, (1 - flatness) * height],
                [width, (1 - flatness) * height],
                [width, height],
                [0, height]
            ]);
        }
        image.src = image_path;
    }
}
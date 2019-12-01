export { }
import { HexagonMap } from "./hex_map_core/HexagonMap";
import { HexagonMapDrawer } from "./HexagonMapDrawer";

let map: HexagonMap;
let drawer;

function initialization() {
    // setup map
    map = new HexagonMap(9, 7);

    // setup drawer
    drawer = new HexagonMapDrawer();
    let flatness: number = 0.7;
    let grid_width: number = 100;
    let grid_width_coefficient: number = 1.95;
    let grid_height_coefficient: number = 1.9;
    let FRAME_WIDTH: number = 1000;
    let origin_x: number = FRAME_WIDTH / 2;
    let origin_y: number = 50;
    let is_draw_coordinate: boolean = true;
    drawer.setupParameter(
        flatness,
        grid_width,
        grid_width_coefficient,
        grid_height_coefficient,
        origin_x,
        origin_y,
        is_draw_coordinate);
    let is_random_mode: boolean = false;
    let random_image_count: number = 3;
    drawer.setupRandomMode(is_random_mode, random_image_count);

    // draw
    drawer.draw(map);
}

initialization();
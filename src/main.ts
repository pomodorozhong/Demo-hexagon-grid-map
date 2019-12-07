export { }
import { HexagonMap } from "./hex_map_core/HexagonMap";
import { HexagonMapDrawer } from "./HexagonMapDrawer";
import { HexagonMapProcessor as HexagonMapProcessor } from "./HexagonMapProcessor";

let map: HexagonMap;
let drawer: HexagonMapDrawer;
let processor: HexagonMapProcessor;

function initialization() {
    // Setup map
    let row_count = 9;
    let col_count = 7;
    map = new HexagonMap(row_count, col_count);

    // Setup drawer
    drawer = new HexagonMapDrawer();
    let flatness: number = 0.7;
    let grid_width: number = 100;
    let grid_width_coefficient: number = 1.95;
    let grid_height_coefficient: number = 1.9;
    let FRAME_WIDTH: number = 1000;
    let origin_x: number = FRAME_WIDTH / 2;
    let origin_y: number = 50;
    let is_draw_coordinate: boolean = false;
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

    // Draw
    drawer.draw(map);

    // Add Click Event Listener
    processor = new HexagonMapProcessor();
    processor.max_hole_count_per_col = 1; // 每欄最多 1 個破洞
    processor.possibility_to_see_a_hole = 0.2; // 破洞機率 20%
    addListener();
}

function addListener() {
    document.getElementsByTagName('button')[0].addEventListener('click',
        () => {
            processor.updateMap(map);
            drawer.clear();
            drawer.draw(map);
        });
}

initialization();

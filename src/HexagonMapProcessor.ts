import { HexagonMap } from "./hex_map_core/HexagonMap";
import { HexagonCell } from "./hex_map_core/HexagonCell";

export class HexagonMapProcessor {
    public max_hole_count_per_col: number = 0;
    public possibility_to_see_a_hole: number = 0;

    constructor() {
    }

    updateMap(map: HexagonMap) {
        for (let index = map.cells.length - 1; index >= 0; index--) {
            if (map.cells[index].x === 0) {
                map.cells.splice(index, 1);
            }
            else {
                map.cells[index].x -= 1;
            }
        }
        map.is_first_col_a_little_col = !map.is_first_col_a_little_col;

        let initial_y: number;
        if (map.col_count % 2 == 1) {
            initial_y = map.is_first_col_a_little_col == true ? 1 : 0;
        }
        else {
            initial_y = map.is_first_col_a_little_col == true ? 0 : 1;
        }
        let hole_count = 0;
        for (let y: number = initial_y; y < map.row_count; y += 2) {
            if (hole_count < this.max_hole_count_per_col) {
                if (Math.random() < this.possibility_to_see_a_hole) {
                    hole_count++;
                    continue;
                }
            }
            let cell = new HexagonCell();
            cell.x = map.col_count - 1;
            cell.y = y;

            map.cells.push(cell);
        }
    }
}
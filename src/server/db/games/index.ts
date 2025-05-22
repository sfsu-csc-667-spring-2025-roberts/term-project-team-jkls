import {create } from "./create";
import { getAvailablGames } from "./get-available-games"
import { getCurrentGames } from "./get-current-games";
import { join } from "./join";
import {getHost} from "./get-host";
import { hasStarted } from "./has-started";

export default {
    getHost,
    create,
    join,
    getAvailablGames,
    getCurrentGames,
    hasStarted,
}
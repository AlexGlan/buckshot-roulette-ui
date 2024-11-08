import Game from "../pages/Game";
import Leaderboard from "../pages/Leaderboard";

const routesConfig = [
    {
        path: '/',
        element: <Game />
    },
    {
        path: 'leaderboard/',
        element: <Leaderboard />
    }
];

export default routesConfig;

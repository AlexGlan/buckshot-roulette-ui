import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPlayerData } from "../app/leaderboardSlice";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { getImageUrl } from "../utils/imageUtils";

const Leaderboard = () => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(state => state.leaderboard.requestStatus);
    const error = useAppSelector(state => state.leaderboard.errorMessage);
    const data = useAppSelector(state => state.leaderboard.playerData);
    const totalGames: number = data.reduce((acc, curr) => acc + curr.games, 0);

    useEffect(() => {
        if (status !== 'idle' && data.length > 0) {
            return;
        } else {  
            dispatch(fetchPlayerData());
        }
    }, [])

    return (
        <>  
            <NavBar />
            <main className="leaderboard-content">
                {error != null ? <p className="error-msg">{error}</p> 
                : status === 'pending' 
                    ? <p className="loading">Loading...</p> :
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Player</th>
                            <th scope="col">W</th>
                            <th scope="col">L</th>
                            <th scope="col">%</th>
                            <th scope="col">Rounds</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(player => (
                                <tr key={player.username}>
                                    <td>
                                        <img src={getImageUrl(`${player.username}.jpg`)} alt="Profile picture" />
                                        {player.username}
                                    </td>
                                    <td>{player.wins}</td>
                                    <td>{player.loses}</td>
                                    <td>{player.winRate}</td>
                                    <td>{player.games}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colSpan={4}>Total</th>
                            <td>{totalGames}</td>
                        </tr>
                    </tfoot>
                </table>
                }
                <Button
                    label="Refresh"
                    handleClick={() => dispatch(fetchPlayerData())}
                    variant="standard"
                />
                <a
                    href="https://docs.google.com/spreadsheets/d/1L0RK2EZM-F2cwKtn5MIOknuWHDABKbvKpelFj9a3oQs/edit?usp=sharing"
                    target="_blank"
                    className="leaderboard__link"
                >
                    Link
                </a>
            </main>
        </>
    )
}

export default Leaderboard;

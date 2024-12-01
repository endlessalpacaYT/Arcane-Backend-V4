import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

class matchmaker {
    public async server(ws: WebSocket, req: any) {

        const ticketId = uuidv4();
        const matchId = uuidv4();
        const sessionId = uuidv4();

        Connecting();
        Waiting();
        Queued();
        SessionAssignment();
        Join();

        function Connecting() {
            ws.send(
                JSON.stringify({
                    payload: {
                        state: "Connecting",
                    },
                    name: "StatusUpdate",
                })
            );
        }

        function Waiting() {
            ws.send(
                JSON.stringify({
                    payload: {
                        totalPlayers: 1,
                        connectedPlayers: 1,
                        state: "Waiting",
                    },
                    name: "StatusUpdate",
                })
            );
        }

        function Queued() {
            ws.send(
                JSON.stringify({
                    payload: {
                        ticketId: ticketId,
                        queuedPlayers: 0,
                        estimatedWaitSec: 0,
                        status: {},
                        state: "Queued",
                    },
                    name: "StatusUpdate",
                })
            );
        }

        function SessionAssignment() {
            ws.send(
                JSON.stringify({
                    payload: {
                        matchId: matchId,
                        state: "SessionAssignment",
                    },
                    name: "StatusUpdate",
                })
            );
        }

        function Join() {
            ws.send(
                JSON.stringify({
                    payload: {
                        matchId: matchId,
                        sessionId: sessionId,
                        joinDelaySec: 1,
                    },
                    name: "Play",
                })
            );
        }
    }
}

export default new matchmaker();
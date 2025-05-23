import { Card, OtherPlayerInfo, PlayerGameState, PlayerInfo } from "global";
import { cloneTemplate } from "../utils";
import { createCard } from "./create-card";

const playerPositions: Record<number, string> = {};
const POSITION_RINGS = [
  [],
  ["bottom"],
  ["bottom", "top"],
  ["bottom", "left", "right"],
  ["bottom", "left", "top", "right"],
];

const initSeatOrder = (gs: PlayerGameState) => {
  const seats = [
    ...Object.entries(gs.players).map(([id, { seat }]) => ({
      id: parseInt(id, 10),
      seat,
    })),
    { id: gs.currentPlayer.id, seat: gs.currentPlayer.seat },
  ].sort((a, b) => a.seat - b.seat);

  /* rotate so current player is first */
  const idx = seats.findIndex((p) => p.id === gs.currentPlayer.id);
  const ordered = seats.slice(idx).concat(seats.slice(0, idx));

  const ring = POSITION_RINGS[ordered.length];
  ordered.forEach((p, i) => (playerPositions[p.id] = ring[i]));
};

const positionFor = (id: number, gs: PlayerGameState) => {
  if (Object.keys(playerPositions).length !== Object.keys(gs.players).length + 1) {
    initSeatOrder(gs);
  }
  return playerPositions[id];
};

const containerForPlayer = (position: string) => {
  const div = cloneTemplate("#player-template")!.firstElementChild as HTMLDivElement;
  div.classList.add(position);
  return div;
};

const fiveBackCards = () => {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 5; i++) {
    frag.appendChild(cloneTemplate("#card-back-template"));
  }
  return frag;
};

export const currentPlayer = ({
  hand,
}: PlayerInfo) => {
  const div = containerForPlayer("bottom");
  const handArea = div.querySelector<HTMLDivElement>(".hand")!;

  hand?.forEach((card: Card) => handArea.appendChild(createCard(card)));

  handArea.addEventListener("click", (e) => {
    const cardDiv = (e.target as HTMLElement).closest<HTMLDivElement>(".card");
    if (!cardDiv) return;

    handArea.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
    cardDiv.classList.add("selected");
  });

  return div;
};


export const otherPlayer = (
  p: OtherPlayerInfo,
  gs: PlayerGameState,
) => {
  const div = containerForPlayer(positionFor(p.id, gs));
  div.querySelector<HTMLDivElement>(".hand")!.appendChild(fiveBackCards());
  return div;
};

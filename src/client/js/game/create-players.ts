import { Card, OtherPlayerInfo, PlayerGameState, PlayerInfo } from "global";
import { createCard } from "./create-card";

export const currentPlayer = (player: PlayerInfo) => {
  const template = document
    .querySelector<HTMLTemplateElement>("#player-template")!
    .content.cloneNode(true) as HTMLElement;

  const div = template.querySelector<HTMLDivElement>(".player")!;
  div.classList.add("bottom");

  div.dataset.userId = player.id.toString();
  
  // Add current turn indicator
  if (player.isCurrent) {
    div.classList.add("current");
  } else {
    div.classList.remove("current");
  }

  if (player.hand) {
    const handDiv = div.querySelector<HTMLDivElement>(".hand")!;

    player.hand.forEach((card: Card) => {
      const cardDiv = createCard(card);
      handDiv.appendChild(cardDiv);
    });
  }

  return div;
};

export const otherPlayer = (player: OtherPlayerInfo, gameState: PlayerGameState) => {
  const template = document
    .querySelector<HTMLTemplateElement>("#player-template")!
    .content.cloneNode(true) as HTMLElement;

  const div = template.querySelector<HTMLDivElement>(".player")!;

  div.dataset.userId = player.id.toString();

  // Add current turn indicator
  if (player.isCurrent) {
    div.classList.add("current");
  } else {
    div.classList.remove("current");
  }

  switch (player.seat) {
    case 1:
      div.classList.add("top");
      break;
    case 2:
      div.classList.add("left");
      break;
    case 3:
      div.classList.add("right");
      break;
  }

  const handDiv = div.querySelector<HTMLDivElement>(".hand")!;
  handDiv.querySelector<HTMLDivElement>(".hand-count")!.textContent = `${
    player.handCount || 0
  } cards`;

  for (let i = 0; i < (player.handCount || 0); i++) {
    const cardDiv = createCard();
    handDiv.appendChild(cardDiv);
  }

  return div;
};

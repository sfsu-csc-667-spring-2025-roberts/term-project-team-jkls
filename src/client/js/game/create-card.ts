import { Card } from "global";
import { cloneTemplate } from "../utils";


const createBackCard = () => {
  const frag = cloneTemplate("#card-back-template");
  return frag.firstElementChild as HTMLDivElement;
};


const createFaceCard = (card: Card) => {
  const frag = cloneTemplate("#card-face-template");
  const div  = frag.querySelector<HTMLDivElement>(".card")!;

  div.dataset.cardId = `${card.id}`;

  const img = div.querySelector<HTMLImageElement>(".card-img")!;
  img.src = card.image_url;
  img.alt = `${card.rank} of ${card.suit}`;

  return div;
};

export const createCard = (card?: Card | null) =>
  card ? createFaceCard(card) : createBackCard();

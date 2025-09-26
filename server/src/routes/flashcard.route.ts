import express from "express";
import {
  updateCardReview,
  addCard,
  createDeck,
  reviewDeck,
} from "../controllers/Flashcard.controller";

const router = express.Router();

router.post("/createDeck", createDeck);
router.post("/decks/:deckId/cards", addCard);
router.get("/decks/:deckId/review", reviewDeck);
router.put("/decks/:deckId/cards/:cardId/review", updateCardReview);

export default router;

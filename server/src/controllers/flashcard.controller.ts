import { Request, Response } from "express";
import flashcardModel from "../models/flashcard.model";

export const createDeck = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(404).json({ message: "All fields must be required" });
    }

    const deck = await flashcardModel.create({
      title,
      createdBy: userId,
      cards: [],
    });

    if (!deck) {
      return res.status(404).json({ message: "Error creating the Deck" });
    }

    return res.status(201).json({
      message: "Deck Created Successfully ",
      success: true,
      deck: deck,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error Creating the Deck : ", error: error.message });
  }
};

export const addCard = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const deckId = req.params.deckId;
    const { front, back } = req.body;

    if (!deckId) {
      return res.status(404).json({ message: "DeckId Missing" });
    }

    if (!front || !back) {
      return res.status(404).json({ message: "All fields are required" });
    }

    const deck = await flashcardModel.findById(deckId);
    if (!deck) {
      return res.status(404).json({ message: "Deck Not Found" });
    }

    deck.cards.push({ front, back, nextDate: new Date() });
    await deck.save();

    return res
      .status(201)
      .json({ message: "Add Card to Deck successfully", success: true, deck });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Error Adding the the Deck", error: error.message });
  }
};

export const reviewDeck = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const deckId = req.params;

    if (!deckId) {
      return res.status(404).json({ message: "DeckId is Required" });
    }

    const deck = await flashcardModel.findById(deckId);

    if (!deck) {
      return res.status(404).json({ message: "Deck Not Found" });
    }

    const now = new Date();
    const dueCards = deck.cards.filter((card) => card.nextDate <= now);

    if (!dueCards) {
      return res.status(404).json({ message: "No due Cards Found" });
    }

    return res.status(200).json({
      message: "Due Cards Retrived Successfully",
      success: true,
      dueCards,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error reviewing the Deck" });
  }
};

export const updateCardReview = async (
  req: Request & { userId?: string },
  res: Response
) => {
  try {
    const { deckId, cardId } = req.params;
    const { rating } = req.body;

    const deck = await flashcardModel.findById(deckId);
    if (!deck) {
      return res.status(404).json({ message: "Deck Not Found" });
    }

    const card = deck.cards.id(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card Not Found" });
    }

    const now = new Date();
    let nextReview: Date;

    switch (rating) {
      case "again":
        nextReview = new Date(now.getTime() + 1 * 60 * 1000);
        break;

      case "hard":
        nextReview = new Date(now.getTime() + 10 * 60 * 1000);
        break;

      case "good":
        nextReview = new Date(now.getTime() + 24 * 60 * 1000);
        break;

      case "easy":
        nextReview = new Date(now.getTime() + 3 * 24 * 60 * 1000);
        break;

      default:
        nextReview = now;
    }

    card.nextDate = nextReview;
    await deck.save();

    return res
      .status(200)
      .json({ message: "Card Review Updated", success: true, card });
  } catch (error: any) {
    return res
      .status(500)
      .json({
        message: "Error Updating the review of deck",
        error: error.meaage,
      });
  }
};

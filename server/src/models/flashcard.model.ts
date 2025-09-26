import mongoose, { Document, ObjectId, Schema, Types } from "mongoose";

export interface Card {
  front: string;
  back: string;
  nextDate: Date;
}

export interface FlashCard extends Document {
  title: string;
  cards: Types.DocumentArray<Card & Document>;
  createdBy: ObjectId;
  sharedWith: ObjectId[];
  createdAt: Date;
}

const CardSchema = new Schema<Card>({
  front: {
    type: String,
    required: true,
  },

  back: {
    type: String,
    required: true,
  },
  nextDate: {
    type: Date,
    default: Date.now,
  },
});

const FlashcardSchema = new Schema<FlashCard>({
  title: {
    type: String,
    required: true,
  },
  cards: [CardSchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<FlashCard>("FlashcardDeck", FlashcardSchema);

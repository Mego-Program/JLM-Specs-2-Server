import express from "express";
import mongoose from "mongoose";
import specsScheme from "../data/specsScheme.js";

const commentsRouter = express.Router();

commentsRouter.post("/:id", async (req, res) => {
  try {
    const { author, content, replyTo } = req.body;
    const specID = req.params.id;
    const commentId = new mongoose.Types.ObjectId();

    let updatedSpec;

    if (replyTo) {
      // Add reply to a comment
      updatedSpec = await specsScheme.findOneAndUpdate(
        { "comments._id": new mongoose.Types.ObjectId(replyTo) },
        {
          $push: {
            "comments.$.replies": {
              _id: commentId,
              author,
              content,
            },
          },
        },
        { new: true }
      );
    } else {
      // Add new comment
      updatedSpec = await specsScheme.findByIdAndUpdate(
        specID,
        {
          $push: {
            comments: {
              _id: commentId,
              author,
              content,
              replies: [],
            },
          },
        },
        { new: true }
      );
    }

    res.json(updatedSpec.comments);
  } catch (error) {
    console.error("Error when adding comment:", error);
    res.status(500).json({ message: error.message });
  }
});

commentsRouter.post("/:id/:commentId/replies", async (req, res) => {
  try {
    const { author, content } = req.body;
    const specID = req.params.id;
    const commentId = req.params.commentId;

    const replyId = new mongoose.Types.ObjectId();

    const updatedSpec = await specsScheme.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(specID),
        "comments._id": new mongoose.Types.ObjectId(commentId),
      },
      {
        $push: {
          "comments.$.replies": {
            _id: replyId,
            author,
            content,
          },
        },
      },
      { new: true }
    );

    res.json(updatedSpec.comments);
  } catch (error) {
    console.error("Error when adding reply:", error);
    res.status(500).json({ message: error.message });
  }
});

commentsRouter.get("/:id", async (req, res) => {
  try {
    const specID = req.params.id;
    const spec = await specsScheme.findById(specID);
    res.json(spec.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

commentsRouter.delete("/:specId/:commentId", async (req, res) => {
  try {
    const specId = req.params.specId;
    const commentId = req.params.commentId;

    await specsScheme.findByIdAndUpdate(specId, {
      $pull: {
        comments: { _id: commentId },
      },
    });
    res.status(200).json({ message: "comment delete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
commentsRouter.delete("/:specId/:commentId/:replyId", async (req, res) => {
  try {
    const { specId, commentId, replyId } = req.params;

    const spec = await specsScheme.findById(specId).lean();

    if(!spec) {
      return res.status(404).json({message: 'Spec not found'});
    }

    await specsScheme.updateOne(
      {_id: specId, 'comments._id': commentId}, 
      {$pull: {'comments.$.replies': {_id: replyId}}}
    );

    res.status(200).json({message: 'Reply deleted'});

  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

export default commentsRouter;

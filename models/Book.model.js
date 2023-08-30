const { Schema, model } = require("mongoose");

const bookSchema = new Schema({
    title: String,
    description: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author"
        },
    },
    {
        timestamps: true
    }
);


module.exports = model("Book", bookSchema);


const mongoose = require("mongoose");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fsctask.qdeo0gr.mongodb.net/?retryWrites=true&w=majority&appName=FscTask`,
        );

        console.log('conected with mongodb')
    } catch (error) {
        console.log(error)
    }
};

module.exports = connectToDatabase;

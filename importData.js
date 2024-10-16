// importData.js
const mongoose = require('mongoose');
const csv = require('csvtojson');
const Customer = require('./models/Customer');
require('dotenv').config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const jsonArray = await csv().fromFile('Customers.csv');

        // Memetakan nama kolom CSV ke nama field di Mongoose
        const formattedData = jsonArray.map((item, index) => ({
            CustomerID: Number(item['CustomerID']),
            Gender: item['Gender'].trim(),
            Age: Number(item['Age']),
            AnnualIncome: Number(item['Annual Income ($)']),
            SpendingScore: Number(item['Spending Score (1-100)']),
            Profession: item['Profession'].trim(),
            WorkExperience: Number(item['Work Experience']),
            FamilySize: Number(item['Family Size']),
        }));

        // Memeriksa data yang tidak lengkap
        const incompleteData = formattedData.filter(item => 
            !item.Profession || item.Profession === ''
        );

        if (incompleteData.length > 0) {
            console.error('Ada data yang tidak lengkap pada field Profession:');
            incompleteData.forEach((item, idx) => {
                console.error(`Baris ${idx + 1}:`, item);
            });
            process.exit(1);
        }

        await Customer.insertMany(formattedData);
        console.log('Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error('Error Importing Data:', error);
        process.exit(1);
    }
};

importData();

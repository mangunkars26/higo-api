const mongoose = require('mongoose');


const CustomerSchema = new mongoose.Schema({
    CustomerID: {
        type: Number,
        required: [true, 'Silakan masukkan CustomerID'],
        unique: true
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: [true, 'Silakkan masukkan jenis kelamin']
    },
    Age: {
        type: Number,
        required: [true, 'Silakkan masukkan umur'],
        min: [0, 'Umur harus 1 tahun keatas!'],
    },
    AnnualIncome: {
        type: Number,
        required: [true, 'Silakan masukkan pemasukkan tahunann'],
        min: [0, 'Harus diisi']
    },
    SpendingScore : {
        type: Number,
        required: [true, 'Silakan masukkan spending score'],
        min: [1, 'Nila spending socore minimal setidaknya 1'],
        max: [100, 'Score spednding tak bisa lebih dari 100']
    },
    Profession: {
        type: String,
        required: [true, 'Silakan masukkan profesi']
    },
    WorkExperience: {
        type: Number,
        required: [true,'Silakan masukkan pengalaman kerja'],
        min: [0, 'Pengalaman kerja harus diisi']
    },
    FamilySize : {
        type: Number,
        required: [true,'Ssilakan masukkan ukuran keluarga'],
        min: [1, 'Setidaknya harus ada 1 anggota keluarga']
    }
    
}, {timestamps: true});

CustomerSchema.index({CustomerID: 1});
CustomerSchema.index({ Gender: 1 });
CustomerSchema.index({ Profession: 1 });

module.exports = mongoose.model('Customer', CustomerSchema);
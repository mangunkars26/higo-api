const Customer = require('../models/Customer');
const ApiResponse = require('../utils/apiResponse');


// @desc    Get all customers with optional filters
// @route   GET /api/customers
// @access  Public

exports.getAllCustomers = async (req, res) => {
    try {
        // Ambil parameter dari query, berikan default untuk page dan limit
        const { page = 1, limit = 10, gender, profession } = req.query;

        // Validasi nilai page dan limit agar selalu positif
        const parsedPage = Math.max(1, parseInt(page, 10)); // page tidak boleh kurang dari 1
        const parsedLimit = Math.max(1, parseInt(limit, 10)); // limit tidak boleh kurang dari 1

        // Buat query berdasarkan filter gender dan profession jika ada
        const query = {};
        if (gender) {
            query.Gender = gender;
        }
        if (profession) {
            query.Profession = profession;
        }

        console.log('Query:', query);
        // Dapatkan data customer berdasarkan query dengan pagination
        const customers = await Customer.find(query)
            .limit(parsedLimit)
            .skip((parsedPage - 1) * parsedLimit) // perbaikan perhitungan skip
            .sort({ CustomerID: 1 }); // Urutkan berdasarkan CustomerID

        // Dapatkan total dokumen yang sesuai dengan query
        const total = await Customer.countDocuments(query);

        // Berikan respon sukses dengan data customer
        return ApiResponse.success(res, 'Customers berhasil diambil', {
            total,
            page: parsedPage,
            limit: parsedLimit,
            data: customers
        });
    } catch (error) {
        console.error(error);
        // Jika ada error, berikan respon error dengan kode status 500
        return ApiResponse.error(res, 'Server error', 500);
    }
};



exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return ApiResponse.error(res, 'Customer tak ditemukan', 404);
        }
        return ApiResponse.success(res, 'Customer sukses ditemukan', customer);
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, 'Server error', 500);
    };
}

// @desc    Create new customer
// @route   POST /api/customers
// @access  Public
exports.createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        return ApiResponse.success(res, 'Customer created successfully', customer, 201);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return ApiResponse.error(res, messages, 400);
        } else if (error.code === 11000) { // Duplicate key
            return ApiResponse.error(res, 'Duplicate field value entered', 400);
        }
        return ApiResponse.error(res, 'Server Error', 500);
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Public
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!customer) {
            return ApiResponse.error(res, 'Customer not found', 404);
        }
        return ApiResponse.success(res, 'Customer updated successfully', customer);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return ApiResponse.error(res, messages, 400);
        }
        return ApiResponse.error(res, 'Server Error', 500);
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Public
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return ApiResponse.error(res, 'Customer not found', 404);
        }
        return ApiResponse.success(res, 'Customer deleted successfully');
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, 'Server Error', 500);
    }
};
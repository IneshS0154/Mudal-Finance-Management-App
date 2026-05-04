const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// @desc    Get all categories (defaults + user's custom)
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    // Base query: Default categories OR user's custom categories
    const query = {
      $or: [
        { isDefault: true },
        { user: req.user.id }
      ]
    };

    // Filter by type if provided
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new custom category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, color, type } = req.body;

    if (!name || !icon || !color || !type) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const category = await Category.create({
      name,
      icon,
      color,
      type,
      isDefault: false,
      user: req.user.id
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a custom category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, color, type } = req.body;

    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category is default (preset)
    if (category.isDefault) {
      return res.status(403).json({ success: false, message: 'Cannot edit preset categories' });
    }

    // Check ownership
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this category' });
    }

    category = await Category.findByIdAndUpdate(
      id,
      { name, icon, color, type },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a custom category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Cannot delete preset categories
    if (category.isDefault) {
      return res.status(403).json({ success: false, message: 'Cannot delete preset categories' });
    }

    // Check ownership
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this category' });
    }

    // Smart Deletion: Check if transactions are using this category
    const linkedTransactionsCount = await Transaction.countDocuments({ categoryId: id });
    
    if (linkedTransactionsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete this category because it is used in existing transactions. Please reassign those transactions first.',
        transactionsLinked: linkedTransactionsCount
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Initialize default categories if they don't exist
// @access  Internal
exports.initDefaultCategories = async () => {
  try {
    const defaultCount = await Category.countDocuments({ isDefault: true });
    if (defaultCount === 0) {
      console.log('No default categories found. Initializing defaults...');
      const defaultCategories = [
        { name: 'Food', icon: 'restaurant', color: '#FF6B6B', type: 'expense', isDefault: true },
        { name: 'Transportation', icon: 'transport', color: '#4ECDC4', type: 'expense', isDefault: true },
        { name: 'Shopping', icon: 'shopping', color: '#FFE66D', type: 'expense', isDefault: true },
        { name: 'Health', icon: 'healthcare', color: '#49B6FF', type: 'expense', isDefault: true },
        { name: 'Entertainment', icon: 'entertainment', color: '#A66CFF', type: 'expense', isDefault: true },
        { name: 'Bills', icon: 'utilities', color: '#54A0FF', type: 'expense', isDefault: true },
        { name: 'Salary', icon: 'salary', color: '#34C759', type: 'income', isDefault: true },
        { name: 'Freelance', icon: 'freelance', color: '#00B894', type: 'income', isDefault: true }
      ];
      await Category.insertMany(defaultCategories);
      console.log('Default categories initialized successfully.');
    }
  } catch (error) {
    console.error('Error initializing default categories:', error);
  }
};

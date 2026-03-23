import pool from '../config/database.js';

// Public: list available payment methods
export const listPaymentMethods = async (req, res) => {
  try {
    const [methods] = await pool.execute('SELECT id, name, provider, code, active FROM payment_methods WHERE active = 1 ORDER BY id');
    res.json(methods);
  } catch (error) {
    console.error('List payment methods error:', error);
    res.status(500).json({ message: 'Ibyago mu byakozwe' });
  }
};

// Admin: create a payment method
export const createPaymentMethod = async (req, res) => {
  try {
    const { name, provider, code } = req.body; // code can be identifier like MTN, AIRTEL
    const [result] = await pool.execute(
      'INSERT INTO payment_methods (name, provider, code, active) VALUES (?, ?, ?, 1)',
      [name, provider, code]
    );
    res.status(201).json({ id: result.insertId, name, provider, code, active: 1 });
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({ message: 'Ibyago mu byakozwe' });
  }
};

// Admin: update method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, provider, code, active } = req.body;
    await pool.execute('UPDATE payment_methods SET name = ?, provider = ?, code = ?, active = ? WHERE id = ?', [name, provider, code, active ? 1 : 0, id]);
    res.json({ id, name, provider, code, active });
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ message: 'Ibyago mu byakozwe' });
  }
};

// Admin: delete method (soft delete)
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE payment_methods SET active = 0 WHERE id = ?', [id]);
    res.json({ id });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ message: 'Ibyago mu byakozwe' });
  }
};

// User: set their payment method and account
export const setUserPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_method_id, account_number } = req.body; // account_number is phone number or bank account
    await pool.execute('UPDATE users SET payment_method_id = ?, payment_account = ? WHERE id = ?', [payment_method_id || null, account_number || null, userId]);
    res.json({ message: 'Payment method updated' });
  } catch (error) {
    console.error('Set user payment error:', error);
    res.status(500).json({ message: 'Ibyago mu byakozwe' });
  }
};

export default { listPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod, setUserPayment };

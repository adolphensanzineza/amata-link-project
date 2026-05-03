import pool from '../config/database.js';

async function run() {
  try {
    console.log('Creating base schema...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(50) UNIQUE,
        role ENUM('farmer','collector','admin') NOT NULL DEFAULT 'farmer',
        village VARCHAR(255),
        sector VARCHAR(255),
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        email_verified BOOLEAN DEFAULT 0,
        verification_code VARCHAR(6),
        verification_expires TIMESTAMP NULL,
        reset_code VARCHAR(6) NULL,
        reset_expires TIMESTAMP NULL,
        payment_method_id INT NULL,
        payment_account VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ users table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS farmers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        collector_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ farmers table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS collectors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ collectors table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS milk_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT NOT NULL,
        collector_id INT NOT NULL,
        liters DECIMAL(10,2) NOT NULL,
        rate_per_liter DECIMAL(10,2) DEFAULT 500.00,
        total_amount DECIMAL(10,2) NOT NULL,
        collection_date DATE NOT NULL DEFAULT (CURDATE()),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
        FOREIGN KEY (collector_id) REFERENCES collectors(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ milk_records table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY,
        milkPricePerLiter DECIMAL(10,2) DEFAULT 500.00,
        siteName VARCHAR(255) DEFAULT 'AmataLink',
        defaultCurrency VARCHAR(10) DEFAULT 'RWF',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    await pool.query('INSERT IGNORE INTO settings (id) VALUES (1)');
    console.log('✅ settings table + default row');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ notifications table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        provider VARCHAR(100),
        code VARCHAR(50),
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ payment_methods table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log('✅ messages table');

    console.log('\n🎉 Base schema created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Schema error:', err.message || err);
    process.exit(1);
  }
}

run();

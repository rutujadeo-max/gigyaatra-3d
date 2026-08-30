const ensureSchema = async (pool) => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      grade VARCHAR(80) NOT NULL,
      avatar_config JSON NOT NULL,
      xp INT NOT NULL DEFAULT 0,
      region_scores JSON NOT NULL,
      quest_activity JSON NOT NULL,
      discovery_card_unlocked TINYINT(1) NOT NULL DEFAULT 0,
      refresh_token TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY users_email_unique (email),
      KEY users_xp_created_idx (xp, created_at)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS quests (
      id CHAR(36) PRIMARY KEY,
      region VARCHAR(80) NOT NULL,
      slug VARCHAR(120) NOT NULL,
      title VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(20) NOT NULL,
      questions JSON NOT NULL,
      xp_reward INT NOT NULL,
      time_limit INT NOT NULL,
      is_featured TINYINT(1) NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY quests_slug_unique (slug),
      UNIQUE KEY quests_region_title_unique (region, title),
      KEY quests_region_idx (region)
    )
  `);

};

module.exports = { ensureSchema };

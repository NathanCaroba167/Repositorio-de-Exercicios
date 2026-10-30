const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function main() {
    const hash = await bcrypt.hash('123456', 10);
    const r = await pool.query(
        "UPDATE usuarios SET senha_hash = $1 WHERE senha_hash = 'temp123' RETURNING email",
        [hash]
    );
    console.log('Senhas atualizadas:', r.rows.map((x) => x.email));
    await pool.end();
}

main();
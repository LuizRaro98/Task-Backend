module.exports = {
	client: 'postgresql',
	connection: {
	  connectionString: 'postgresql://sa:uLxePbbHM6vFOoBRXRXOXCnlOVyyVrbA@dpg-cs140ve8ii6s73cv6tp0-a.oregon-postgres.render.com/tasks_s850',
	  ssl: {
		rejectUnauthorized: false
	  }
	},
	pool: {
	  min: 2,
	  max: 10
	},
	migrations: {
	  tableName: 'knex_migrations'
	}
  };
  
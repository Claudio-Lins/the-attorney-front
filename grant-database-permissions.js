const { PrismaClient } = require("./src/generated/prisma");

const prisma = new PrismaClient();

/**
 * Script para conceder permissões automáticas em todas as tabelas do banco
 * Este script deve ser executado após migrations para garantir que ferramentas
 * externas como n8n tenham acesso às tabelas
 */
async function grantDatabasePermissions() {
	try {
		console.log("🔐 Iniciando concessão de permissões no banco de dados...");

		// Garante acesso ao schema public
		await prisma.$executeRaw`GRANT USAGE ON SCHEMA public TO PUBLIC;`;
		console.log("✅ Permissões de USAGE no schema public concedidas");

		// Lista todas as tabelas no schema public
		const tables = await prisma.$queryRaw`
			SELECT tablename 
			FROM pg_tables 
			WHERE schemaname = 'public';
		`;

		console.log(`📋 Encontradas ${tables.length} tabelas no schema public`);

		// Concede permissões para cada tabela
		for (const table of tables) {
			const tableName = table.tablename;

			// Pula tabelas de sistema do Prisma
			if (tableName.startsWith("_prisma_migrations")) {
				console.log(`⏭️  Pulando tabela de sistema: ${tableName}`);
				continue;
			}

			try {
				// Usar $executeRawUnsafe para interpolar o nome da tabela
				await prisma.$executeRawUnsafe(`
					GRANT SELECT, INSERT, UPDATE, DELETE 
					ON TABLE public."${tableName}" 
					TO PUBLIC;
				`);
				console.log(`✅ Permissões concedidas para tabela: ${tableName}`);
			} catch (error) {
				console.log(`⚠️  Erro ao conceder permissões para ${tableName}:`, error.message);
			}
		}

		// Concede permissões em todas as sequências
		await prisma.$executeRaw`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO PUBLIC;`;
		console.log("✅ Permissões em sequências concedidas");

		// Lista todas as funções e procedures
		const functions = await prisma.$queryRaw`
			SELECT routine_name 
			FROM information_schema.routines 
			WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
		`;

		// Concede permissões de execução em funções (se existirem)
		if (functions.length > 0) {
			await prisma.$executeRaw`GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO PUBLIC;`;
			console.log(`✅ Permissões de execução em ${functions.length} funções concedidas`);
		}

		console.log("🎉 Concessão de permissões concluída com sucesso!");
	} catch (error) {
		console.error("❌ Erro ao conceder permissões:", JSON.stringify(error, null, 2));
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

async function main() {
	try {
		await grantDatabasePermissions();
		process.exit(0);
	} catch (error) {
		console.error("❌ Falha na concessão de permissões:", error);
		process.exit(1);
	}
}

// Executar se chamado diretamente
if (require.main === module) {
	main();
}

module.exports = { grantDatabasePermissions };

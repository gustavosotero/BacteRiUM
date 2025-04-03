import asyncpg
import asyncio

DATABASE_URL = "postgresql://cyanobox_admin:AYmc1LRD9PPGcH8KbGhE@cyanobox-db.cu3weo4yye22.us-east-1.rds.amazonaws.com/cyanobox"

async def test_connection():
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("✅ Connected to AWS RDS successfully!")
        await conn.close()
    except Exception as e:
        print(f"❌ Database connection error: {e}")

asyncio.run(test_connection())

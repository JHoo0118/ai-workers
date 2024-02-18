bstart:
	source env/bin/activate && python backend/main.py

fstart:
	npm run dev

freeze:
	pip freeze > backend/requirements.txt

install:
	pip install -r backend/requirements.txt

generate:
	cd backend && prisma generate

reset:
	cd backend && prisma migrate reset

db_push:
	cd backend && prisma db push

.PHONY: bstart fstart freeze install generate reset db_push
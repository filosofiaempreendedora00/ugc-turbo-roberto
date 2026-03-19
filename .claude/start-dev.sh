#!/bin/bash
export PATH="/Users/roberto/.nvm/versions/node/v20.20.1/bin:$PATH"
cd "/Users/roberto/Projetos do Claude/Plataforma UGC"
exec node node_modules/.bin/next dev --port 3000

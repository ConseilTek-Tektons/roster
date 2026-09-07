using './main.bicep'

param appName = 'roster'
param environment = 'production'
param location = 'eastus2'
param containerImage = 'ghcr.io/conseiltek-tektons/roster:latest'
param databaseName = 'roster'
param databaseAdmin = 'roster_admin'

// Secure parameters are resolved from the deployment runner environment and
// are never stored in this file or the generated deployment JSON.
param databasePassword = readEnvironmentVariable('POSTGRES_PASSWORD')
param nextAuthSecret = readEnvironmentVariable('NEXTAUTH_SECRET')
param oidcClientSecret = readEnvironmentVariable('OIDC_CLIENT_SECRET')
param openAiApiKey = readEnvironmentVariable('OPENAI_API_KEY')

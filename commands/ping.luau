local process = require('@lune/process')

local payloadText = process.env.DISCORD_COMMAND_PAYLOAD or '{}'

local username = 'usuário'
local commandType = 'comando'

local ok, payload = pcall(function()
	return process.jsonDecode(payloadText)
end)

if ok and type(payload) == 'table' then
	username = payload.username or username
	commandType = payload.type or commandType
end

print(process.jsonEncode({
	content = 'Pong! Bot online, ' .. username .. '. Tipo: ' .. commandType .. '.'
}))

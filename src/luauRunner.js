import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export function runLuauCommand(commandName, payload) {
  return new Promise((resolve) => {
    const commandPath = path.join(projectRoot, 'commands', `${commandName}.luau`);
    const lune = process.env.LUNE_BIN || 'lune';

    const child = spawn(lune, ['run', commandPath], {
      cwd: projectRoot,
      env: {
        ...process.env,
        DISCORD_COMMAND_PAYLOAD: JSON.stringify(payload),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      resolve({
        ok: false,
        content: `Erro ao iniciar o Lune: ${error.message}`,
      });
    });

    child.on('close', (code) => {
      if (code !== 0) {
        const message = stderr.trim() || `Comando Luau terminou com código ${code}.`;
        resolve({ ok: false, content: message });
        return;
      }

      const output = stdout.trim();
      if (!output) {
        resolve({ ok: true, content: 'Comando executado, mas não retornou resposta.' });
        return;
      }

      try {
        const parsed = JSON.parse(output);
        resolve({
          ok: true,
          content: String(parsed.content || 'Sem resposta.'),
        });
      } catch {
        resolve({ ok: true, content: output });
      }
    });
  });
}

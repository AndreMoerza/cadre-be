import * as path from 'path';
import * as fs from 'fs/promises';
import { spawn } from 'child_process';

function joinCwd(...p: string[]) {
  return path.join.apply(null, [process.cwd(), ...p]);
}

const bufferToString = (buff: Buffer) => {
  return Buffer.from(buff).toString();
};

async function main() {
  try {
    const migrationPath = joinCwd('src', 'db', 'migrations');
    let migFiles = [];

    try {
      migFiles = await fs.readdir(migrationPath);
    } catch (error) {
      if (
        error?.code === 'ENOENT' ||
        error?.message?.includes?.('No such file or directory')
      ) {
        console.log('Migration folder not found. Creating one...');
        await fs.mkdir(migrationPath, { recursive: true });
      } else {
        throw new Error(error);
      }
    }

    for await (const mig of migFiles) {
      console.log(`Removing ${mig}...`);
      await fs.unlink(joinCwd('src', 'db', 'migrations', mig));
    }

    const migName = `Tmp-${Date.now()}`;
    const migGenCommand = () =>
      new Promise((resolve, reject) => {
        console.log(`Generating migration...`);
        const svc = spawn(
          'npm',
          ['run', `migration:generate`, `--name=${migName}`],
          {
            cwd: joinCwd('./'),
          },
        );
        async function onData(_, data: Buffer) {
          return new Promise((res) => {
            const out = bufferToString(data);
            console.log(out);
            if (out.includes('has been generated successfully')) {
              res(true);
            } else if (
              out.includes('No changes in database schema were found')
            ) {
              res(false);
            }
          });
        }

        svc.stdout.on(`data`, async (data) => {
          try {
            const res = await onData(svc, data);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });

        svc.stderr.on(`data`, async (data) => {
          try {
            const res = await onData(svc, data);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      });

    const migExecCommand = () =>
      new Promise((resolve, reject) => {
        const svc = spawn('npm', ['run', 'migration:run'], {
          cwd: joinCwd('./'),
        });
        async function onData(_, data) {
          return new Promise((res) => {
            const out = bufferToString(data);
            console.log(out);
            if (out.includes('executed successfully.')) {
              res(out);
            } else if (
              out.includes('No changes in database schema were found')
            ) {
              res(out);
            }
          });
        }

        svc.stdout.on(`data`, async (data) => {
          try {
            const res = await onData(svc, data);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });

        svc.stderr.on(`data`, async (data) => {
          try {
            const res = await onData(svc, data);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      });

    const isGenerated = await migGenCommand();
    if (!isGenerated) {
      console.log('No changes in database schema were found');
      process.exit(0);
    }

    console.log('Migration generated successfully! 🎉');

    await migExecCommand();

    console.log('Migration executed successfully! 🎉');

    process.exit(0);
  } catch (error) {
    throw new Error(error);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

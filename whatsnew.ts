/*
 * whatsnew - What's new with Homebrew & macOS
 * This is a small utility function which checks for new homebrew updates
 * and new macOS updates. It was based off a shell script I saw on reddit so if you're
 * the original author, please let me know and I'll happily credit you.
 *
 * Usage:
 *
 * `whatsnew`
 */

type StdOut = 'inherit' | 'piped' | 'null' | number;

async function run(cmd: string, stdout: StdOut = 'piped'): Promise<any> {
  const p = Deno.run({
    cmd: cmd.split(' '),
    stdout,
  });

  await p.status();

  if (stdout === 'piped') {
    const rawOutput = await p.output();
    const output = new TextDecoder().decode(rawOutput);

    return output;
  }
}

function printItems(items: string): void {
  items
    .split('\n')
    .filter(Boolean)
    .forEach((item: string) => console.log(`* ${item}`));
}

try {
  console.log('\nChecking homebrew packages...\n');

  await run('brew update');

  const newPackages = await run('brew outdated --quiet');
  const newCasks = await run('brew cask outdated --quiet');

  const numPackages = newPackages.split('\n').length;
  const numCasks = newCasks.split('\n').length;

  if (numPackages > 0 || numCasks < 0) {
    console.log('New package updates available:');
    printItems(newPackages);
    printItems(newCasks);
  } else {
    console.log('No new package updates available.');
  }

  console.log('Checking macOS updates...\n');

  await run('softwareupdate -l', 'inherit');
} catch (error) {
  console.error(error);
}

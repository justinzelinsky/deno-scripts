const REPO_NAME = 'git@github.com:justinzelinsky/react-starter.git';

const [projectName] = Deno.args;

if (!projectName) {
  throw new Error('Missing Project Name');
}

try {
  const gitClone = Deno.run({
    cmd: ['git', 'clone', REPO_NAME],
  });

  await gitClone.status();

  await Deno.rename('react-starter', projectName);

  const packageJSONPath = `./${projectName}/package.json`;

  const decoder = new TextDecoder('utf-8');
  const data = await Deno.readFile(packageJSONPath);
  const packageJSON = JSON.parse(decoder.decode(data));

  packageJSON['name'] = projectName;
  packageJSON['version'] = '1.0.0';
  packageJSON['description'] = '';

  const encoder = new TextEncoder();
  const newPackageJSON = encoder.encode(JSON.stringify(packageJSON, null, 2));
  await Deno.writeFile(packageJSONPath, newPackageJSON);

  Deno.chdir(projectName);

  console.log('Installing dependencies...');

  const npmInstall = Deno.run({
    cmd: ['npm', 'install'],
  });

  await npmInstall.status();

  console.log(`Project ${projectName} is ready to go!`);
} catch (error) {
  console.error(error);
}

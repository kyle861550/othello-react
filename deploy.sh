#!/bin/bash

# Build the othello-model project
cd othello-model
npm install
npm run build
cd ..

# Build and deploy React project
cd samples/othello-react
npm install
npm run build
cd ../..

# Build and deploy Vue project
cd samples/othello-vue
npm install
npm run build
cd ../..

# Build and deploy Svelte project
cd samples/othello-svelte
npm install
npm run build
cd ../..

# Create a temporary directory to hold the build output
mkdir -p tmp-deploy

# Move the build outputs to the temporary directory
mv samples/othello-react/dist tmp-deploy/react
mv samples/othello-vue/dist tmp-deploy/vue
mv samples/othello-svelte/public/build tmp-deploy/svelte

# Create a main index.html for GitHub Pages redirection
cat <<EOF > tmp-deploy/index.html
<!DOCTYPE html>
<html>
<head>
  <title>Othello Projects</title>
</head>
<body>
  <h1>Welcome to Othello Projects</h1>
  <p>Please follow the links to the specific projects:</p>
  <ul>
    <li><a href="./react">React Project</a></li>
    <li><a href="./vue">Vue Project</a></li>
    <li><a href="./svelte">Svelte Project</a></li>
  </ul>
</body>
</html>
EOF

# Initialize a new Git repository in the temporary directory
cd tmp-deploy
git init
git remote add origin https://github.com/kyle861550/othello-react.git
git checkout -b gh-pages

# Commit and push the build outputs to the gh-pages branch
git add .
git commit -m "Deploy to GitHub Pages"
git push -f origin gh-pages

# Clean up the temporary directory
cd ..
rm -rf tmp-deploy

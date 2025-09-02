# vSweatbox

This is a tool designed to help C Ground students gain experience with CRC and vStrips before training sessions with mentors. The tech stack
is Vite, React, and Typescript. There is no back end or state saving. 

### Setup
```
npm install
npm run dev
```

### Deployment
This repository is configured with `gh-pages` to automatically deploy through github actions. The `gh-pages` branch is the source of files
for the statically hosted site. It should not be updated manually, it can be updated through the following command, which executes a build,
pushes to the `gh-pages` branch, and triggers a github action to deploy to github pages.
```
npm deploy
```

### Monitoring
A feedback link is located at the bottom of menu pages to this google [form](https://forms.gle/Kr6hm6GaJ3BAKjgr7).
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git Sync Rule
- After completing a task or code changes and ensuring successful compilation, the agent MUST automatically stage, commit, and push the changes to GitHub.
- To push, the agent should temporarily set the remote URL using the GITHUB_TOKEN value found in the local .env.local file, execute git push -u origin main, and then immediately restore the remote URL back to https://github.com/Oguzhan1511/etsy.git to prevent credentials from being saved in .git/config.

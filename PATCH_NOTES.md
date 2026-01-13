Rules for this repository

Never commit:
	• 	node_modules/
	• 	.next/
	• 	dist/
	• 	build/
	• 	out/
	• 	.DS_Store
	• 	Large media files (.mp4/.mov over 50MB)

Before every commit:
	• 	Run git status
	• 	If thousands of files appear, STOP
	• 	Fix .gitignore before committing

If something goes wrong:
	1. 	Export non-deps files using git diff –name-only
	2. 	Create a patch using git diff
	3. 	Reapply patch onto a fresh branch from origin/dev
	4. 	Never try to push node_modules or build output
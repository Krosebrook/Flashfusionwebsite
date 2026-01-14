#!/bin/bash

# Script to delete 10 obsolete branches safely
# Run this script after reviewing BRANCH_CLEANUP_SUMMARY.md

echo "Deleting 10 obsolete branches..."
echo ""

# Delete fully merged branches (7)
echo "Deleting fully merged branches..."
git push origin --delete claude/build-missing-criticals-01YapFE3hYRDQugLCkxxA8Sw
git push origin --delete claude/check-env-vars-011CUV1wH8viRdnhjX4QGdLG
git push origin --delete copilot/build-new-feature-refactor-again
git push origin --delete copilot/build-next-feature-production-grade
git push origin --delete copilot/fix-uncommitted-pushes
git push origin --delete copilot/scaffold-completed-feature
git push origin --delete copilot/sub-pr-14-again

echo ""
echo "Deleting outdated branches..."
git push origin --delete claude/phase1-2-fixes-011CUeiMH5ZEppMrLYoHsion
git push origin --delete dependabot/npm_and_yarn/motion-12.23.24
git push origin --delete dependabot/npm_and_yarn/build-tools-61257fea64

echo ""
echo "✅ All branches deleted successfully!"
echo "Remaining branches:"
git branch -r | grep -v HEAD

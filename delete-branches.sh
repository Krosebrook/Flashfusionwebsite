#!/bin/bash

# Script to delete 10 branches safely:
# - 7 fully merged branches (0 unique commits)
# - 3 outdated branches (superseded by main)
# Run this script after reviewing BRANCH_CLEANUP_SUMMARY.md

set -e  # Exit on any error to prevent partial deletion

echo "Deleting 10 branches (7 fully merged + 3 outdated)..."
echo ""

# Delete fully merged branches (7)
echo "Deleting 7 fully merged branches..."
git push origin --delete claude/build-missing-criticals-01YapFE3hYRDQugLCkxxA8Sw
git push origin --delete claude/check-env-vars-011CUV1wH8viRdnhjX4QGdLG
git push origin --delete copilot/build-new-feature-refactor-again
git push origin --delete copilot/build-next-feature-production-grade
git push origin --delete copilot/fix-uncommitted-pushes
git push origin --delete copilot/scaffold-completed-feature
git push origin --delete copilot/sub-pr-14-again

echo ""
echo "Deleting 3 outdated branches..."
git push origin --delete claude/phase1-2-fixes-011CUeiMH5ZEppMrLYoHsion
git push origin --delete dependabot/npm_and_yarn/motion-12.23.24
git push origin --delete dependabot/npm_and_yarn/build-tools-61257fea64

echo ""
echo "✅ All 10 branches deleted successfully!"
echo ""
echo "Remaining branches (should be 2: main and copilot/merge-remaining-branches):"
git branch -r | grep -v HEAD | grep -E "(origin/main|origin/copilot/merge-remaining-branches)"

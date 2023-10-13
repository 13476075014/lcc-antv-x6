#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:13476075014/lcc-antv-x6.git master:main
# 国内的gitee也推送一份
git push -f git@gitee.com:13476075014/lcc-antv-x6.git master:main

cd -
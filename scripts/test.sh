echo "npm version: $(npm -v)"
echo "node version: $(node -v)"

# 安装依赖
yarn install --immutable || exit 1

# 代码基础测试
yarn test

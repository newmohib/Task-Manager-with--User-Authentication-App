module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "./index.js",
      watch: true,
      env: {
        NODE_ENV: "dev",
        PORT: 8000,
      },
    },
    {
      name: "frontend-app",
      script: "./frontend-server.js",
      watch: true,
      env: {
        NODE_ENV: "dev",
        ADMIN_END_PORT: 4000,
      },
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "tidyapp-backend",
      script: "./src/server.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      combine_logs: true,
      merge_logs: true,
    },
  ],
};

module.exports = {
    apps: [
        {
            name: "inertia-ssr",
            cwd: __dirname,
            script: "wp",
            exec_mode: "fork",
            instances: 1,
            args: ["inertia:start-ssr"],
        },
    ],
};

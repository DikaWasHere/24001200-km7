// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://bb691f9299a67c7f5e01e4a2743904ef@o4508285293428736.ingest.de.sentry.io/4508323351625808",
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// // Manually call startProfiler and stopProfiler
// // to profile the code in between
// Sentry.profiler.startProfiler();

// // Starts a transaction that will also be profiled
// Sentry.startSpan(
//   {
//     name: "My First Transaction",
//   },
//   () => {
//     // the code executing inside the transaction will be wrapped in a span and profiled
//   }
// );

// // Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// // your application until the process exits or stopProfiling is called.
// Sentry.profiler.stopProfiler();
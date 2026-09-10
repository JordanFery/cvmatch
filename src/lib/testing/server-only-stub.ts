// Stand-in for the "server-only" package under Vitest. Next.js's bundler
// swaps "server-only" for a no-op when building for the server (and makes
// it throw when a client bundle accidentally pulls it in) — but Vitest runs
// plain Node with no such client/server bundling step, so the real package
// would throw unconditionally. This alias (see vitest.config.mts) keeps the
// guard meaningful in the actual app while not breaking unit tests for the
// server-only modules that import it.
export {};

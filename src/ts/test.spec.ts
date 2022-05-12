const testsContext = require.context('./', true, /index.spec.ts$/);
testsContext.keys().forEach(testsContext);

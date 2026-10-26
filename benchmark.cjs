const { performance } = require('perf_hooks');

const missingModules = [
  { module: { id: 'm1', title: 'Module 1' }, category: 'cat1' },
  { module: { id: 'm2', title: 'Module 2' }, category: 'cat1' },
  { module: { id: 'm3', title: 'Module 3' }, category: 'cat1' },
  { module: { id: 'm4', title: 'Module 4' }, category: 'cat1' },
  { module: { id: 'm5', title: 'Module 5' }, category: 'cat1' },
];

const mockGenerateLessonContent = async (id, title, category) => {
  // simulate network delay 100ms
  return new Promise(resolve => setTimeout(resolve, 100));
};

async function testSequential() {
  const start = performance.now();
  for (const item of missingModules) {
    try {
      await mockGenerateLessonContent(item.module.id, item.module.title, item.category);
      // await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(error);
    }
  }
  const end = performance.now();
  return end - start;
}

async function testParallel() {
  const start = performance.now();
  const promises = missingModules.map(async (item) => {
    try {
      await mockGenerateLessonContent(item.module.id, item.module.title, item.category);
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.all(promises);
  const end = performance.now();
  return end - start;
}

async function run() {
  const seq = await testSequential();
  const par = await testParallel();
  console.log(`Sequential: ${seq.toFixed(2)}ms`);
  console.log(`Parallel: ${par.toFixed(2)}ms`);
  console.log(`Improvement: ${((seq - par) / seq * 100).toFixed(2)}%`);
}

run();

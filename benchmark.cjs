const { performance } = require('perf_hooks');

const modules = Array.from({ length: 1000 }, (_, i) => ({ id: `m${i}`, title: `Module ${i}` }));
const activeModuleId = 'm500';

function withoutMemo() {
    let nextModule;
    for (let i = 0; i < 100000; i++) {
        nextModule = modules[modules.findIndex(m => m.id === activeModuleId) + 1];
    }
    return nextModule;
}

let memoizedIndex = -1;
let lastModules = null;
let lastActiveModuleId = null;

function withMemo() {
    let nextModule;
    for (let i = 0; i < 100000; i++) {
        if (lastModules !== modules || lastActiveModuleId !== activeModuleId) {
            memoizedIndex = modules.findIndex(m => m.id === activeModuleId);
            lastModules = modules;
            lastActiveModuleId = activeModuleId;
        }
        nextModule = modules[memoizedIndex + 1];
    }
    return nextModule;
}

const start1 = performance.now();
withoutMemo();
const end1 = performance.now();

const start2 = performance.now();
withMemo();
const end2 = performance.now();

console.log(`Without memo: ${end1 - start1} ms`);
console.log(`With memo: ${end2 - start2} ms`);
